using WebProdavnica.Models;

namespace WebProdavnica.Interface
{
    public interface IUnitOfWork
    {
        IRepository<User> Korisnici { get; }
  
        IRepository<Product> Proizvodi { get; }
   
        Task Save();
    }
}
