namespace WebProdavnica.DTOs
{
    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Brend { get; set; } = string.Empty;
        public string Boja { get; set; } = string.Empty;
        public double Cena { get; set; }
        public int Kolicina { get; set; }
        public string Slika { get; set; } = string.Empty;
    }
}
