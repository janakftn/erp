namespace WebProdavnica.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public UserDTO Korisnik { get; set; } = new UserDTO();
        public string Status { get; set; } = string.Empty;
        public DateTime Datum { get; set; }
        public string Placanje { get; set; } = string.Empty;
        public List<OrderItemDTO> Proizvodi { get; set; } = new List<OrderItemDTO>();

    }
}

