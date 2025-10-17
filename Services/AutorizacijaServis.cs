using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;
using WebProdavnica.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net; // ✅ dodato da "BC" bude prepoznat
using System; // za Exception, DateTime itd.
using System.Linq;
using System.Threading.Tasks;

namespace WebProdavnica.Services
{
    public class AutorizacijaServis : IAutorizacijaServis
    {
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AutorizacijaServis(IConfiguration configuration, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // ✳️ REGISTRACIJA — svi novi korisnici su automatski "Klijent"
        public async Task Register(RegisterDTO registerDTO)
        {
            var allUsers = await _unitOfWork.Korisnici.GetAll();
            var existingUser = allUsers.FirstOrDefault(u => u.Email.Equals(registerDTO.Email, StringComparison.OrdinalIgnoreCase));

            if (existingUser != null)
                throw new Exception("Korisnik sa ovim emailom već postoji.");

            var user = _mapper.Map<User>(registerDTO);
            user.Tip = TipKorisnika.Klijent;
            user.Sifra = BC.BCrypt.HashPassword(user.Sifra);

            await _unitOfWork.Korisnici.Insert(user);
            await _unitOfWork.Save();
        }

        // ✳️ GENERISANJE JWT TOKENA
        private string GetToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.KorisnickoIme!),
                new Claim(ClaimTypes.Role, user.Tip.ToString()),
                new Claim("Id", user.Id.ToString()),
                new Claim("Email", user.Email!),
            };

            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: signIn
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ✳️ LOGIN LOGIKA
        public async Task<LoginResponseDto> Login(LoginDTO loginDTO)
        {
            var users = await _unitOfWork.Korisnici.GetAll();
            var user = users.FirstOrDefault(u => u.Email.Equals(loginDTO.Email));

            if (user == null)
                throw new Exception("Ne postoji korisnik sa tim email-om.");

            // Debug log — vidi da li hash odgovara
            Console.WriteLine($"🔍 Login pokušaj za {loginDTO.Email}");
            Console.WriteLine($"➡️  Pronađen korisnik: {user.Email} (tip: {user.Tip})");
            Console.WriteLine($"🔑  Lozinka validna: {BC.BCrypt.Verify(loginDTO.Sifra, user.Sifra)}");

            if (!BC.BCrypt.Verify(loginDTO.Sifra, user.Sifra))
                throw new Exception("Pogrešna lozinka.");

            var token = GetToken(user);

            return new LoginResponseDto
            {
                Token = token,
                Role = user.Tip.ToString(),
          
            };

        }
    }
}
