using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebProdavnica.Models
{
    public class Product : Entitet
    {
        [Required]
        public string Ime { get; set; } = String.Empty;

        [Required]
        public double Cena { get; set; }
     
        
        [Required]
        public int Kolicina { get; set; }
        [Required]
        public string Boja { get; set; } = String.Empty;
        [Required]
        public string Brend { get; set; } = String.Empty;
        [Required]
        public string Slika { get; set; } = String.Empty;




    }
}
