using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;

namespace WebProdavnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutorizacijaController : ControllerBase
    {
        IAutorizacijaServis _autorizacijaServis;

        public AutorizacijaController(IAutorizacijaServis autorizacijaServis)
        {
            _autorizacijaServis = autorizacijaServis;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDTO loginDTO)
        {
            var response = await _autorizacijaServis.Login(loginDTO);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO registerDTO)
        {
            try
            {
                await _autorizacijaServis.Register(registerDTO);
                return Ok(new { message = "Registracija uspešna! Možete se prijaviti." });
            }
            catch (Exception ex)
            {
                // Vraćamo 400 i JSON sa porukom
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
