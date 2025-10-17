namespace WebProdavnica.DTOs
{
    public class CreateOrderDTO
    {
        public int UserId { get; set; }
        public string Placanje { get; set; } = "Pouzece";
        public List<OrderItemDTO> Stavke { get; set; } = new List<OrderItemDTO>();
    
}
}
