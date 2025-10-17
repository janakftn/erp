using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace WebProdavnica.DTOs
{
    public class CreateProductDTO
    {
        [Required(ErrorMessage = "Popunite ime proizvoda")]
        public string Ime { get; set; } = string.Empty;

        [Required(ErrorMessage = "Popunite cenu proizvoda")]
        public double Cena { get; set; }

        [Required(ErrorMessage = "Popunite količinu proizvoda")]
        public int Kolicina { get; set; }

        [Required(ErrorMessage = "Popunite boju proizvoda")]
        public string Boja { get; set; } = string.Empty;

        [Required(ErrorMessage = "Popunite brend proizvoda")]
        public string Brend { get; set; } = string.Empty;

       //putanja do fajla nakon sto se sacuva
        public string Slika { get; set; } = string.Empty;

   //fajl koji se uplouduje sa fronta
        public IFormFile? SlikaFile { get; set; }
    }
}
