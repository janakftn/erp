using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebProdavnica.DTOs
{
    public class ProizvodDTO
    {
        public int Id { get; set; }
        [Required]
        public string Ime { get; set; } = String.Empty;

        [Required]
        public double Cena { get; set; }
        [Required]
        public double ProdajnaCena { get; set; }
        [Required]
        public int Kolicina { get; set; }
        [Required]
        public string Boja { get; set; } = String.Empty;
        [Required]
        public string Brend { get; set; } = String.Empty;
        public string Slika { get; set; }
    }
}
