using WebProdavnica.Interface;
using WebProdavnica.Models;
using WebProdavnica.Settings;

namespace WebProdavnica.UnitOfWorkConfig
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ProdavnicaDbContext _context;

        public UnitOfWork(ProdavnicaDbContext context,
            IRepository<User> korisnici,

        
        IRepository<Product> proizvodi
   )
        {
            _context = context;
            Korisnici = korisnici;


            Proizvodi = proizvodi;
        }
          

        public IRepository<User> Korisnici { get; }
   
        public IRepository<Product> Proizvodi { get; }
       



        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
