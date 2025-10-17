using Microsoft.EntityFrameworkCore;
using WebProdavnica.Models;
using BCrypt.Net;


namespace WebProdavnica.Settings
{
    public class ProdavnicaDbContext : DbContext
    {
    
        public DbSet<User> Korisnici { get; set; }
      
        public DbSet<Product> Proizvodi { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }



        public ProdavnicaDbContext(DbContextOptions options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProdavnicaDbContext).Assembly);

            var admin = new User
            {
                Id = 1,
                KorisnickoIme = "admin",
                Email = "admin@example.com",
                Ime = "Admin",
                Prezime = "Admin",
                Adresa = "Administracija",
                BrojTelefona = "000000000",
                Tip = TipKorisnika.Admin,
                Sifra = BCrypt.Net.BCrypt.HashPassword("admin123") 
            };

            modelBuilder.Entity<User>().HasData(admin);
        }
    }
}
