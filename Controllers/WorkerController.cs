using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;
using WebProdavnica.Models;

namespace WebProdavnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkerController : ControllerBase
    {
        private readonly IWorkerServis _workerServis;

        public WorkerController(IWorkerServis workerServis)
        {
            _workerServis = workerServis;
        }

        // --- GET svi proizvodi ---
        [HttpGet("products")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProizvode()
        {
            var proizvodi = await _workerServis.GetProizvode();
            return Ok(proizvodi);
        }

        // --- POST dodavanje proizvoda ---
        [Authorize(Roles = "Admin")]
        [HttpPost("proizvodi")]
        public async Task<IActionResult> DodajProizvod([FromForm] CreateProductDTO kreirajProizvodDTO)
        {
            if (!ModelState.IsValid)
            {
                // Uzima sve greške i vraća ih u JSON-u
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();
                return BadRequest(new { Poruke = errors });
            }
            if (kreirajProizvodDTO.SlikaFile != null)
            {
                // 1. Ime fajla
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(kreirajProizvodDTO.SlikaFile.FileName)}";

                // 2. Putanja gde se čuva (tvoj folder images)
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                var path = Path.Combine(folderPath, fileName);

                // Snimanje
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await kreirajProizvodDTO.SlikaFile.CopyToAsync(stream);
                }

                // Putanja za frontend
                kreirajProizvodDTO.Slika = $"/images/{fileName}";
            }

            // 5. Prosledjujemo DTO servisu
            await _workerServis.KreirajProizvod(kreirajProizvodDTO);

            return Ok();
        }

        

      

        // --- DELETE proizvod ---
        [Authorize(Roles = "Admin")]
        [HttpDelete("proizvodi/{id}")]
        public async Task<IActionResult> ObrisiProizvod(int id)
        {
            await _workerServis.ObrisiProizvod(id); // u servisu treba da obriše iz baze i obriše sliku sa diska
            return Ok();
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("proizvodi/{id}")]
        public async Task<IActionResult> AzurirajProizvod(int id, [FromForm] UpdateProductDTO dto)
        {
            await _workerServis.AzurirajProizvod(id, dto);
            return Ok();
        }

    }
}
