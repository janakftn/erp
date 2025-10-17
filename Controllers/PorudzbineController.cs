using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using System.IO;
using System.Text.Json;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;
using WebProdavnica.Models;
using WebProdavnica.Settings;

namespace WebProdavnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PorudzbineController : ControllerBase
    {
        private readonly IOrderServis _orderServis;
        private readonly ProdavnicaDbContext _context;
        private readonly StripeSettings _stripeSettings;

        public PorudzbineController(
            IOrderServis orderServis,
            ProdavnicaDbContext context,
            IOptions<StripeSettings> stripeSettings) 
        {
            _orderServis = orderServis;
            _context = context;
            _stripeSettings = stripeSettings.Value;
        }

      
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderServis.GetAllOrders();
            return Ok(orders);
        }

        [HttpPost]
        [Authorize(Roles = "Klijent")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO dto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");
            if (userIdClaim == null)
                return Unauthorized("Nevalidan token");

            dto.UserId = int.Parse(userIdClaim.Value);
            var order = await _orderServis.CreateOrder(dto);

            return Ok(new { message = "Porudžbina uspešno kreirana!", order });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateDTO dto)
        {
            if (!Enum.TryParse<StatusPorudzbine>(dto.Status, out var status))
                return BadRequest("Nevalidan status porudžbine");

            await _orderServis.UpdateStatus(id, dto.Status);
            return Ok(new { message = $"Status porudžbine promenjen na '{dto.Status}'." });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound("Porudžbina nije pronađena.");

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Porudžbina je uspešno obrisana." });
        }

        [HttpGet("isporucene")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDeliveredOrders()
        {
            var isporucene = _context.Orders
                .Where(o => o.Status == StatusPorudzbine.Isporuceno)
                .ToList();

            return Ok(isporucene);
        }

        [HttpGet("naCekanju")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingOrders()
        {
            var naCekanju = _context.Orders
                .Where(o => o.Status == StatusPorudzbine.NaCekanju)
                .ToList();

            return Ok(naCekanju);
        }

        // ========================= STRIPE CHECKOUT =========================
        [HttpPost("create-checkout-session")]
        [Authorize(Roles = "Klijent")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] List<CheckoutItemDTO> items)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");
            if (userIdClaim == null)
                return Unauthorized("Nevalidan token");

            var lineItems = new List<SessionLineItemOptions>();

            foreach (var item in items)
            {
                var product = await _context.Proizvodi.FindAsync(item.ProductId);
                if (product == null)
                    return BadRequest($"Proizvod sa ID {item.ProductId} ne postoji!");

                lineItems.Add(new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "rsd",
                        UnitAmount = (long)(product.Cena * 100),
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = product.Ime,
                            Images = product.Slika != null ? new List<string> { $"http://localhost:5134{product.Slika}" } : null
                        }
                    },
                    Quantity = item.Kolicina
                });
            }

            var metadata = new Dictionary<string, string>
    {
        { "UserId", userIdClaim.Value },
        { "Products", JsonSerializer.Serialize(items) }
    };

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                Mode = "payment",
                LineItems = lineItems,
                SuccessUrl = "http://localhost:3000/success",
                CancelUrl = "http://localhost:3000/cancel",
                Metadata = metadata
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            return Ok(new { url = session.Url });
        }


        // ========================= STRIPE WEBHOOK =========================
        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                Console.WriteLine("📩 Primljen Stripe event...");
                Console.WriteLine(json);

                var signatureHeader = Request.Headers["Stripe-Signature"];
                Console.WriteLine("🔑 Signature: " + signatureHeader);

                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    signatureHeader,
                    _stripeSettings.WebhookSecret,
                    throwOnApiVersionMismatch: false
);

                Console.WriteLine($"✅ Stripe event tip: {stripeEvent.Type}");

                if (stripeEvent.Type == "checkout.session.completed")
                {
                    var session = stripeEvent.Data.Object as Session;
                    if (session == null)
                    {
                        Console.WriteLine("❌ Session je null!");
                        return BadRequest("Stripe session je null");
                    }

                    Console.WriteLine("✅ Stripe session uspešno primljena.");

                    if (session.Metadata == null || !session.Metadata.ContainsKey("UserId") || !session.Metadata.ContainsKey("Products"))
                    {
                        Console.WriteLine("❌ Metadata nije pronađena u sesiji!");
                        return BadRequest("Nedostaju metadata podaci iz Stripe sesije");
                    }

                    int userId = int.Parse(session.Metadata["UserId"]);
                    Console.WriteLine($"👤 UserId: {userId}");

                    var productsJson = session.Metadata["Products"];
                    Console.WriteLine($"🛒 Products JSON: {productsJson}");

                    var products = JsonSerializer.Deserialize<List<OrderItemDTO>>(productsJson);

                    var dto = new CreateOrderDTO
                    {
                        UserId = userId,
                        Placanje = "Stripe",
                        Stavke = products
                    };

                    Console.WriteLine("💾 Kreiram porudžbinu...");
                    await _orderServis.CreateOrder(dto);
                    Console.WriteLine("✅ Porudžbina kreirana.");
                }

                return Ok();
            }
            catch (StripeException e)
            {
                Console.WriteLine("⚠️ Stripe greška: " + e.Message);
                return BadRequest($"Stripe greška: {e.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("💥 Greška: " + ex.Message);
                return StatusCode(500, $"Greška: {ex.Message}");
            }
        }

    }
}
