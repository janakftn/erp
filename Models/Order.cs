using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebProdavnica.Models
{
    public enum StatusPorudzbine { NaCekanju, Isporuceno }

    public class Order : Entitet
    {
        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User Korisnik { get; set; } = null!;

        [Required]
        public StatusPorudzbine Status { get; set; } = StatusPorudzbine.NaCekanju;

        [Required]
        public DateTime Datum { get; set; } = DateTime.Now;

        public string Placanje { get; set; } = "Pouzece"; 

        public virtual List<OrderItem> Stavke { get; set; } = new List<OrderItem>();
    }
}