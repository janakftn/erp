using Microsoft.Identity.Client;
using WebProdavnica.DTOs;

namespace WebProdavnica.Interface
{
    public interface IUserServis
    {
        Task<List<UserProductDTO>> GetProizvode();
        
        Task<List<UserProductDTO>> FiltrirajProizvode(double? cena, string? boja, string? brend);

    }
}
