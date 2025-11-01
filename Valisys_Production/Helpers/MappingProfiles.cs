using AutoMapper;
using Valisys_Production.DTOs;
using Valisys_Production.Models;

namespace Valisys_Production.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Almoxarifado
            CreateMap<Almoxarifado, AlmoxarifadoReadDto>();
            CreateMap<AlmoxarifadoCreateDto, Almoxarifado>();
            CreateMap<AlmoxarifadoUpdateDto, Almoxarifado>();

            // Categoria Produto
            CreateMap<CategoriaProduto, CategoriaProdutoReadDto>();
            CreateMap<CategoriaProdutoCreateDto, CategoriaProduto>();
            CreateMap<CategoriaProdutoUpdateDto, CategoriaProduto>();

            // Fase Produção
            CreateMap<FaseProducao, FaseProducaoReadDto>();
            CreateMap<FaseProducaoCreateDto, FaseProducao>();
            CreateMap<FaseProducaoUpdateDto, FaseProducao>();

            // Fornecedor
            CreateMap<Fornecedor, FornecedorReadDto>();
            CreateMap<FornecedorCreateDto, Fornecedor>();
            CreateMap<FornecedorUpdateDto, Fornecedor>();

            // Lote
            CreateMap<Lote, LoteReadDto>()
                .ForMember(dest => dest.NumeroLote, opt => opt.MapFrom(src => src.CodigoLote));
            CreateMap<LoteCreateDto, Lote>();
            CreateMap<LoteUpdateDto, Lote>();

            // Movimentação
            CreateMap<Movimentacao, MovimentacaoReadDto>()
                .ForMember(dest => dest.ProdutoNome, opt => opt.MapFrom(src => src.Produto.Nome))
                .ForMember(dest => dest.AlmoxarifadoOrigemNome, opt => opt.MapFrom(src => src.AlmoxarifadoOrigem.Nome))
                .ForMember(dest => dest.AlmoxarifadoDestinoNome, opt => opt.MapFrom(src => src.AlmoxarifadoDestino.Nome))
                .ForMember(dest => dest.UsuarioNome, opt => opt.MapFrom(src => src.Usuario.Nome));
            CreateMap<MovimentacaoCreateDto, Movimentacao>();
            CreateMap<MovimentacaoUpdateDto, Movimentacao>();

            // Ordem de Produção
            CreateMap<OrdemDeProducao, OrdemDeProducaoReadDto>()
                .ForMember(dest => dest.ProdutoNome, opt => opt.MapFrom(src => src.Produto.Nome))
                .ForMember(dest => dest.AlmoxarifadoNome, opt => opt.MapFrom(src => src.Almoxarifado.Nome))
                .ForMember(dest => dest.FaseAtualNome, opt => opt.MapFrom(src => src.FaseAtual.Nome))
                .ForMember(dest => dest.LoteNumero, opt => opt.MapFrom(src => src.Lote != null ? src.Lote.CodigoLote : null));
            CreateMap<OrdemDeProducaoCreateDto, OrdemDeProducao>();
            CreateMap<OrdemDeProducaoUpdateDto, OrdemDeProducao>();

            // Perfil
            CreateMap<Perfil, PerfilReadDto>();
            CreateMap<PerfilCreateDto, Perfil>();
            CreateMap<PerfilUpdateDto, Perfil>();

            // Produto
            CreateMap<Produto, ProdutoReadDto>()
                .ForMember(dest => dest.Codigo, opt => opt.MapFrom(src => src.CodigoInternoProduto))
                .ForMember(dest => dest.EstoqueMinimo, opt => opt.Ignore())
                .ForMember(dest => dest.CategoriaProdutoNome, opt => opt.MapFrom(src => src.CategoriaProduto.Nome))
                .ForMember(dest => dest.UnidadeMedidaSigla, opt => opt.MapFrom(src => src.UnidadeMedida.Sigla))
                .ForMember(dest => dest.AlmoxarifadoEstoqueId, opt => opt.Ignore())
                .ForMember(dest => dest.AlmoxarifadoEstoqueNome, opt => opt.Ignore());
            CreateMap<ProdutoCreateDto, Produto>()
                .ForMember(dest => dest.UnidadeMedida, opt => opt.Ignore())
                .ForMember(dest => dest.CategoriaProduto, opt => opt.Ignore());
            CreateMap<ProdutoUpdateDto, Produto>()
                .ForMember(dest => dest.UnidadeMedida, opt => opt.Ignore())
                .ForMember(dest => dest.CategoriaProduto, opt => opt.Ignore());

            // Solicitação Produção
            CreateMap<SolicitacaoProducao, SolicitacaoProducaoReadDto>()
                .ForMember(dest => dest.Codigo, opt => opt.MapFrom(src => src.CodigoSolicitacao))
                .ForMember(dest => dest.QuantidadeSolicitada, opt => opt.MapFrom(src => src.Quantidade))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ProdutoNome, opt => opt.MapFrom(src => src.Produto.Nome))
                .ForMember(dest => dest.UsuarioSolicitanteId, opt => opt.MapFrom(src => src.EncarregadoId))
                .ForMember(dest => dest.UsuarioSolicitanteNome, opt => opt.MapFrom(src => src.Encarregado.Nome))
                .ForMember(dest => dest.UsuarioAprovadorNome, opt => opt.MapFrom(src => src.UsuarioAprovacao != null ? src.UsuarioAprovacao.Nome : null));
            CreateMap<SolicitacaoProducaoCreateDto, SolicitacaoProducao>()
                .ForMember(dest => dest.CodigoSolicitacao, opt => opt.MapFrom(src => src.Codigo))
                .ForMember(dest => dest.Quantidade, opt => opt.MapFrom(src => src.QuantidadeSolicitada));
            CreateMap<SolicitacaoProducaoUpdateDto, SolicitacaoProducao>()
                .ForMember(dest => dest.CodigoSolicitacao, opt => opt.MapFrom(src => src.Codigo))
                .ForMember(dest => dest.Quantidade, opt => opt.MapFrom(src => src.QuantidadeSolicitada));

            // Tipo Ordem de Produção
            CreateMap<TipoOrdemDeProducao, TipoOrdemDeProducaoReadDto>();
            CreateMap<TipoOrdemDeProducaoCreateDto, TipoOrdemDeProducao>();
            CreateMap<TipoOrdemDeProducaoUpdateDto, TipoOrdemDeProducao>();

            // Usuário
            CreateMap<Usuario, UsuarioReadDto>();
            CreateMap<UsuarioCreateDto, Usuario>()
                .ForMember(dest => dest.SenhaHash, opt => opt.MapFrom(src => src.Senha));
            CreateMap<UsuarioUpdateDto, Usuario>()
                .ForMember(dest => dest.SenhaHash, opt => opt.Ignore());
        }
    }
}