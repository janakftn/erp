using WebProdavnica.Models;

namespace WebProdavnica.Interface
{
    public interface IRepository<T> where T : Entitet
    {
        Task<IList<T>> GetAll();
        Task<T> GetById(int id);
        Task Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task Save();
    }
}
