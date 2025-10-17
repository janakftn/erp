using WebProdavnica.DTOs;
using WebProdavnica.Models;

namespace WebProdavnica.Interface
{
    public interface IWorkerServis
    {
        Task<List<ProizvodDTO>> GetProizvode();
        Task KreirajProizvod(CreateProductDTO kreirajProizvodDTO);

 
        Task ObrisiProizvod(int id);
        Task AzurirajProizvod(int id, UpdateProductDTO dto);

    }
}
