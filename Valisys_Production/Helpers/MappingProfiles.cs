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
            CreateMap<FornecedorCreateDto, Fornecedor>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.DataCadastro, opt => opt.Ignore());

            CreateMap<FornecedorUpdateDto, Fornecedor>()
                .ForMember(dest => dest.DataCadastro, opt => opt.Ignore());
            // Lote
            CreateMap<Lote, LoteReadDto>()
                .ForMember(dest => dest.NumeroLote, opt => opt.MapFrom(src => src.CodigoLote));
            CreateMap<LoteCreateDto, Lote>();
            CreateMap<LoteUpdateDto, Lote>()
                .ForMember(dest => dest.CodigoLote, opt => opt.MapFrom(src => src.NumeroLote));

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

            CreateMap<OrdemDeProducaoCreateDto, OrdemDeProducao>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.DataInicio, opt => opt.Ignore())
                .ForMember(dest => dest.DataFim, opt => opt.Ignore())
                .ForMember(dest => dest.SolicitacaoProducaoId, opt => opt.Ignore())
                .ForMember(dest => dest.Produto, opt => opt.Ignore())
                .ForMember(dest => dest.Almoxarifado, opt => opt.Ignore())
                .ForMember(dest => dest.FaseAtual, opt => opt.Ignore())
                .ForMember(dest => dest.Lote, opt => opt.Ignore())
                .ForMember(dest => dest.TipoOrdemDeProducao, opt => opt.Ignore())
                .ForMember(dest => dest.SolicitacaoProducao, opt => opt.Ignore());

            CreateMap<OrdemDeProducaoUpdateDto, OrdemDeProducao>()
                .ForMember(dest => dest.DataInicio, opt => opt.Ignore())
                .ForMember(dest => dest.Produto, opt => opt.Ignore())
                .ForMember(dest => dest.Almoxarifado, opt => opt.Ignore())
                .ForMember(dest => dest.FaseAtual, opt => opt.Ignore())
                .ForMember(dest => dest.Lote, opt => opt.Ignore())
                .ForMember(dest => dest.TipoOrdemDeProducao, opt => opt.Ignore())
                .ForMember(dest => dest.SolicitacaoProducao, opt => opt.Ignore())
                .ForMember(dest => dest.SolicitacaoProducaoId, opt => opt.Ignore());

            CreateMap<Perfil, PerfilReadDto>();
            CreateMap<PerfilCreateDto, Perfil>();
            CreateMap<PerfilUpdateDto, Perfil>();

            CreateMap<Produto, ProdutoReadDto>()
                .ForMember(dest => dest.Codigo, opt => opt.MapFrom(src => src.CodigoInternoProduto))
                .ForMember(dest => dest.Classificacao, opt => opt.MapFrom(src => src.Classificacao.ToString()))
                .ForMember(dest => dest.ClassificacaoId, opt => opt.MapFrom(src => (int)src.Classificacao))
                .ForMember(dest => dest.EstoqueMinimo, opt => opt.Ignore())
                .ForMember(dest => dest.CategoriaProdutoNome, opt => opt.MapFrom(src => src.CategoriaProduto.Nome))
                .ForMember(dest => dest.UnidadeMedidaSigla, opt => opt.MapFrom(src => src.UnidadeMedida.Sigla))
                .ForMember(dest => dest.AlmoxarifadoEstoqueId, opt => opt.Ignore())
                .ForMember(dest => dest.AlmoxarifadoEstoqueNome, opt => opt.Ignore());
            CreateMap<ProdutoCreateDto, Produto>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Ativo, opt => opt.Ignore())
                .ForMember(dest => dest.DataCadastro, opt => opt.Ignore())
                .ForMember(dest => dest.UnidadeMedida, opt => opt.Ignore())
                .ForMember(dest => dest.CategoriaProduto, opt => opt.Ignore());
            CreateMap<ProdutoUpdateDto, Produto>()
                .ForMember(dest => dest.CodigoInternoProduto, opt => opt.MapFrom(src => src.Codigo))
                .ForMember(dest => dest.DataCadastro, opt => opt.Ignore())
                .ForMember(dest => dest.UnidadeMedida, opt => opt.Ignore())
                .ForMember(dest => dest.CategoriaProduto, opt => opt.Ignore())
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
                .ForMember(dest => dest.Observacoes, opt => opt.MapFrom(src => src.Observacoes));

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
                .ForMember(dest => dest.Quantidade, opt => opt.MapFrom(src => src.QuantidadeSolicitada))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.DataSolicitacao, opt => opt.Ignore())
                .ForMember(dest => dest.DataAprovacao, opt => opt.Ignore())
                .ForMember(dest => dest.EncarregadoId, opt => opt.Ignore())
                .ForMember(dest => dest.Encarregado, opt => opt.Ignore())
                .ForMember(dest => dest.UsuarioAprovacaoId, opt => opt.Ignore())
                .ForMember(dest => dest.UsuarioAprovacao, opt => opt.Ignore())
                .ForMember(dest => dest.TipoOrdemDeProducaoId, opt => opt.Ignore())
                .ForMember(dest => dest.TipoOrdemDeProducao, opt => opt.Ignore())
                .ForMember(dest => dest.Produto, opt => opt.Ignore())
                .ForMember(dest => dest.OrdemDeProducao, opt => opt.Ignore())
                .ForMember(dest => dest.Itens, opt => opt.Ignore())
                .ForMember(dest => dest.Observacoes, opt => opt.Ignore());
            CreateMap<SolicitacaoProducaoUpdateDto, SolicitacaoProducao>()
                .ForMember(dest => dest.CodigoSolicitacao, opt => opt.MapFrom(src => src.Codigo))
                .ForMember(dest => dest.Quantidade, opt => opt.MapFrom(src => src.QuantidadeSolicitada))
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.DataSolicitacao, opt => opt.Ignore())
                .ForMember(dest => dest.DataAprovacao, opt => opt.Ignore())
                .ForMember(dest => dest.EncarregadoId, opt => opt.Ignore())
                .ForMember(dest => dest.Encarregado, opt => opt.Ignore())
                .ForMember(dest => dest.UsuarioAprovacaoId, opt => opt.Ignore())
                .ForMember(dest => dest.UsuarioAprovacao, opt => opt.Ignore())
                .ForMember(dest => dest.TipoOrdemDeProducaoId, opt => opt.Ignore())
                .ForMember(dest => dest.TipoOrdemDeProducao, opt => opt.Ignore())
                .ForMember(dest => dest.Produto, opt => opt.Ignore())
                .ForMember(dest => dest.OrdemDeProducao, opt => opt.Ignore())
                .ForMember(dest => dest.Itens, opt => opt.Ignore())
                .ForMember(dest => dest.Observacoes, opt => opt.Ignore());

            CreateMap<TipoOrdemDeProducao, TipoOrdemDeProducaoReadDto>();
            CreateMap<TipoOrdemDeProducaoCreateDto, TipoOrdemDeProducao>()
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Codigo))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.OrdensDeProducao, opt => opt.Ignore());
            CreateMap<TipoOrdemDeProducaoUpdateDto, TipoOrdemDeProducao>()
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Codigo))
                .ForMember(dest => dest.OrdensDeProducao, opt => opt.Ignore());

            CreateMap<Usuario, UsuarioReadDto>()
                 .ForMember(dest => dest.PerfilNome, opt => opt.MapFrom(src => src.Perfil != null ? src.Perfil.Nome : "Sem Perfil"));
            CreateMap<UsuarioCreateDto, Usuario>()
                .ForMember(dest => dest.SenhaHash, opt => opt.MapFrom(src => src.Senha))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.DataCadastro, opt => opt.Ignore())
                .ForMember(dest => dest.Perfil, opt => opt.Ignore());
            CreateMap<UsuarioUpdateDto, Usuario>()
                .ForMember(dest => dest.SenhaHash, opt => opt.Ignore())
                .ForMember(dest => dest.DataCadastro, opt => opt.Ignore())
                .ForMember(dest => dest.Perfil, opt => opt.Ignore());

            CreateMap<FichaTecnica, FichaTecnicaReadDto>()
                .ForMember(dest => dest.ProdutoNome, opt => opt.MapFrom(src => src.Produto.Nome));

            CreateMap<FichaTecnicaItem, FichaTecnicaItemReadDto>()
                .ForMember(dest => dest.ProdutoComponenteNome, opt => opt.MapFrom(src => src.ProdutoComponente.Nome))
                .ForMember(dest => dest.ProdutoComponenteCodigo, opt => opt.MapFrom(src => src.ProdutoComponente.CodigoInternoProduto))
                .ForMember(dest => dest.UnidadeMedida, opt => opt.MapFrom(src => src.ProdutoComponente.UnidadeMedida.Sigla));
            CreateMap<FichaTecnicaUpdateDto, FichaTecnica>()
                .ForMember(dest => dest.Itens, opt => opt.Ignore());
        }
    }
}