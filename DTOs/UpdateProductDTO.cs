using Microsoft.AspNetCore.Http;

namespace WebProdavnica.DTOs
{
    public class UpdateProductDTO
    {
        public string? Ime { get; set; }
        public double? Cena { get; set; }
        public int? Kolicina { get; set; }
        public string? Boja { get; set; }
        public string? Brend { get; set; }
        public IFormFile? SlikaFile { get; set; } // opcionalno nova slika
    }
}
