using WebProdavnica.DTOs;

namespace WebProdavnica.Interface
{
    public interface IAutorizacijaServis
    {
        public Task Register(RegisterDTO registerDTO);

        public Task<LoginResponseDto> Login(LoginDTO loginDTO);
    }
}
