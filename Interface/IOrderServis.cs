using WebProdavnica.DTOs;

namespace WebProdavnica.Interface
{
    public interface IOrderServis
    {
        Task<List<OrderDTO>> GetAllOrders();
        Task<OrderDTO> CreateOrder(CreateOrderDTO dto);
        Task UpdateStatus(int orderId, string newStatus);
    }
}
