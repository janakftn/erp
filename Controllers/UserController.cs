using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;

namespace WebProdavnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]


    public class UserController : ControllerBase
    {
        IUserServis _userServis;

        public UserController(IUserServis userServis)
        {
            _userServis = userServis;
        }

        [HttpGet("products")]
        [Authorize(Roles = "Klijent")]
        public async Task<IActionResult> GetProizvode()
        {
            var proizvodi = await _userServis.GetProizvode();
            return Ok(proizvodi);
        }
        
        [HttpGet("filtirani-proizvodi")]
        [Authorize(Roles = "Klijent")]
        public async Task<IActionResult> FiltrirajProizvode(double? cena, string? boja, string? brend)
        {
            var proizvodi = await _userServis.FiltrirajProizvode(cena, boja, brend);
            return Ok(proizvodi);
        }

     
    }
}
