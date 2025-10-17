using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;
using WebProdavnica.Models;
using WebProdavnica.Settings;

namespace WebProdavnica.Services
{
    public class OrderServis : IOrderServis
    {
        private readonly ProdavnicaDbContext _context;
        private readonly IMapper _mapper;

        public OrderServis(ProdavnicaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<OrderDTO>> GetAllOrders()
        {
            // učitaj sve porudžbine sa korisnikom i stavkama
            var orders = await _context.Orders
                .Include(o => o.Korisnik)
                .Include(o => o.Stavke)
                    .ThenInclude(s => s.Proizvod)
                .ToListAsync();

            // null-safe mapiranje u DTO
            var dto = orders.Select(o => new OrderDTO
            {
                Id = o.Id,
                Korisnik = new UserDTO
                {
                    Id = o.Korisnik.Id,
                    KorisnickoIme = o.Korisnik.KorisnickoIme,
                    Ime = o.Korisnik.Ime,
                    Prezime = o.Korisnik.Prezime,
                    Email = o.Korisnik.Email,
                    Adresa = o.Korisnik.Adresa,
                    BrojTelefona = o.Korisnik.BrojTelefona,
                    Tip = o.Korisnik.Tip.ToString()
                },
                Status = o.Status.ToString(),
                Datum = o.Datum,
                Placanje = o.Placanje,
                Proizvodi = o.Stavke.Select(s => new OrderItemDTO
                {
                    ProductId = s.ProductId,
                    Ime = s.Proizvod.Ime,
                    Brend = s.Proizvod.Brend,
                    Boja = s.Proizvod.Boja,
                    Cena = s.Proizvod.Cena,
                    Kolicina = s.Kolicina,
                    Slika = s.Proizvod.Slika
                }).ToList()
            }).ToList();


            return dto;
        }

        public async Task<OrderDTO> CreateOrder(CreateOrderDTO dto)
        {
            var order = new Order
            {
                UserId = dto.UserId,
                Placanje = dto.Placanje,
                Datum = DateTime.Now,
                Status = StatusPorudzbine.NaCekanju,
                Stavke = dto.Stavke.Select(s => new OrderItem
                {
                    ProductId = s.ProductId,
                    Kolicina = s.Kolicina
                }).ToList()
            }; 
            
            // OVDJE SMANJUJEMO KOLIČINU PROIZVODA U BAZI 
            foreach (var stavka in order.Stavke)
            {
                var proizvod = await _context.Proizvodi.FindAsync(stavka.ProductId);
                if (proizvod == null)
                    throw new Exception($"Proizvod sa ID {stavka.ProductId} ne postoji!");

                if (proizvod.Kolicina < stavka.Kolicina)
                    throw new Exception($"Nema dovoljno proizvoda '{proizvod.Ime}' na stanju.");

                proizvod.Kolicina -= stavka.Kolicina; // smanji stanje
            }

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            return await GetAllOrders().ContinueWith(t => t.Result.First(o => o.Id == order.Id));
        }

        public async Task UpdateStatus(int orderId, string newStatus)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) throw new Exception("Porudzbina ne postoji");

            if (Enum.TryParse<StatusPorudzbine>(newStatus, out var status))
                order.Status = status;

            await _context.SaveChangesAsync();
        }

    }
}
