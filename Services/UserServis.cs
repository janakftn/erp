using AutoMapper;
using WebProdavnica.DTOs;
using WebProdavnica.Interface;
using WebProdavnica.Models;

using Stripe.Checkout;
using System.Drawing;

namespace WebProdavnica.Services
{
    public class UserServis : IUserServis
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserServis(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<UserProductDTO>> GetProizvode()
        {
            var proizvodi = await _unitOfWork.Proizvodi.GetAll();
            return _mapper.Map<List<UserProductDTO>>(proizvodi);
        }

      

      

        public async Task<List<UserProductDTO>> FiltrirajProizvode(double? cena, string? boja, string? brend)
        {
            var product = await _unitOfWork.Proizvodi.GetAll();
            var filrtriraniProizvodi = product.Where(p =>
                (cena == null || p.Cena < cena) &&
                (boja == null || p.Boja == boja) &&
                (brend == null || p.Brend == brend));
            return _mapper.Map<List<UserProductDTO>>(filrtriraniProizvodi);

        }

    }
}
