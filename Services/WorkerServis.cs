using AutoMapper;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;
using WebProdavnica.Models;

namespace WebProdavnica.Services
{
    public class WorkerServis : IWorkerServis
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public WorkerServis(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<ProizvodDTO>> GetProizvode()
        {
            var proizvodi = await _unitOfWork.Proizvodi.GetAll();
            return _mapper.Map<List<ProizvodDTO>>(proizvodi);
        }

     

        public async Task KreirajProizvod(CreateProductDTO kreirajProizvodDTO)
        {
            var proizvod = _mapper.Map<Product>(kreirajProizvodDTO);
            await _unitOfWork.Proizvodi.Insert(proizvod);
            await _unitOfWork.Save();
        }

    
        public async Task ObrisiProizvod(int id)
        {
            var proizvod = await _unitOfWork.Proizvodi.GetById(id);
            if (proizvod == null) throw new Exception("Proizvod ne postoji!");

            // Brisanje fajla sa diska
            if (!string.IsNullOrEmpty(proizvod.Slika))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", proizvod.Slika.TrimStart('/'));
                if (File.Exists(filePath)) File.Delete(filePath);
            }

            _unitOfWork.Proizvodi.Delete(proizvod);
            await _unitOfWork.Save();
        }
        public async Task AzurirajProizvod(int id, UpdateProductDTO dto)
        {
            var proizvod = await _unitOfWork.Proizvodi.GetById(id);
            if (proizvod == null) throw new Exception("Proizvod ne postoji!");

            proizvod.Ime = dto.Ime ?? proizvod.Ime;
            proizvod.Cena = dto.Cena ?? proizvod.Cena;
            proizvod.Kolicina = dto.Kolicina ?? proizvod.Kolicina;
            proizvod.Boja = dto.Boja ?? proizvod.Boja;
            proizvod.Brend = dto.Brend ?? proizvod.Brend;

            if (dto.SlikaFile != null)
            {
                // brisanje stare slike
                if (!string.IsNullOrEmpty(proizvod.Slika))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", proizvod.Slika.TrimStart('/'));
                    if (File.Exists(oldPath)) File.Delete(oldPath);
                }
                // nova slika
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(dto.SlikaFile.FileName)}";
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                var path = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await dto.SlikaFile.CopyToAsync(stream);
                }

                proizvod.Slika = $"/images/{fileName}";
            }

            await _unitOfWork.Save();
        }


    }
}
