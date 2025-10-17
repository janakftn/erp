using AutoMapper;
using WebProdavnica.DTOs;
using WebProdavnica.Models;
using BC = BCrypt.Net;

namespace WebProdavnica.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterDTO, User>();
            CreateMap<User, RegisterDTO>();
            CreateMap<Product, ProizvodDTO>().ReverseMap();
            CreateMap<Product, UserProductDTO>()
                .ForMember(dest => dest.Cena, opt => opt.MapFrom(src => src.Cena));
            CreateMap<Product, CreateProductDTO>().ReverseMap();

        }
    }
}
