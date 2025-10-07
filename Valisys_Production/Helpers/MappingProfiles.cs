using AutoMapper;
using Valisys_Production.DTOs;
using Valisys_Production.Models;

namespace Valisys_Production.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles() 
        {
            CreateMap<ProdutoCreateDto, Produto>()
            .ForMember(dest => dest.UnidadeMedida, opt => opt.Ignore())
            .ForMember(dest => dest.CategoriaProduto, opt => opt.Ignore());

            CreateMap<OrdemDeProducaoCreateDto, OrdemDeProducao>();
        }
        
    }
}
