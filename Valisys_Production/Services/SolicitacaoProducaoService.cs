using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
namespace Valisys_Production.Services
{
    public class SolicitacaoProducaoService : ISolicitacaoProducaoService
    {
        private readonly ISolicitacaoProducaoRepository _repository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IOrdemDeProducaoService _ordemDeProducaoService;

        public SolicitacaoProducaoService(
            ISolicitacaoProducaoRepository repository,
            IProdutoRepository produtoRepository,
            IOrdemDeProducaoService ordemDeProducaoService)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
            _ordemDeProducaoService = ordemDeProducaoService;
        }

        public async Task<SolicitacaoProducao> CreateAsync(SolicitacaoProducao solicitacaoProducao)
        {
            if (solicitacaoProducao == null)
                throw new ArgumentNullException(nameof(solicitacaoProducao));

            if (solicitacaoProducao.Itens == null || !solicitacaoProducao.Itens.Any())
                throw new ArgumentException("A solicitação de produção deve conter pelo menos um item.");

            foreach (var item in solicitacaoProducao.Itens)
            {
                if (item.Quantidade <= 0)
                    throw new ArgumentException("A quantidade do item deve ser maior que zero.");

                var produto = await _produtoRepository.GetByIdAsync(item.ProdutoId);
                if (produto == null)
                    throw new KeyNotFoundException($"Produto com ID {item.ProdutoId} não encontrado.");
            }

            solicitacaoProducao.Status = StatusSolicitacaoProducao.Pendente;
            solicitacaoProducao.DataSolicitacao = DateTime.UtcNow;


            return await _repository.AddAsync(solicitacaoProducao);
        }

        public async Task<SolicitacaoProducao?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
                throw new ArgumentException("ID da Solicitação inválido.");

            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<SolicitacaoProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(SolicitacaoProducao solicitacaoProducao)
        {
            if (solicitacaoProducao == null || solicitacaoProducao.Id == Guid.Empty)
                throw new ArgumentException("Dados da Solicitação inválidos ou ID ausente.");

            var existingSolicitacao = await _repository.GetByIdAsync(solicitacaoProducao.Id);
            if (existingSolicitacao == null)
            {
                throw new KeyNotFoundException($"Solicitação com ID {solicitacaoProducao.Id} não encontrada.");
            }

            if (existingSolicitacao.Status != StatusSolicitacaoProducao.Pendente && existingSolicitacao.Status != StatusSolicitacaoProducao.EmProducao)
            {
                throw new InvalidOperationException($"A solicitação não pode ser alterada no status '{existingSolicitacao.Status}'.");
            }

            return await _repository.UpdateAsync(solicitacaoProducao);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
                throw new ArgumentException("ID da Solicitação inválido.");

            var existingSolicitacao = await _repository.GetByIdAsync(id);
            if (existingSolicitacao == null)
            {
                return false;
            }

            if (existingSolicitacao.Status == StatusSolicitacaoProducao.Aprovada || existingSolicitacao.Status == StatusSolicitacaoProducao.EmProducao)
            {
                throw new InvalidOperationException("Solicitações aprovadas ou em produção não podem ser excluídas.");
            }

            return await _repository.DeleteAsync(id);
        }

        public async Task<List<OrdemDeProducao>> AprovarSolicitacaoAsync(Guid solicitacaoId, Guid usuarioAprovadorId)
        {
            if (usuarioAprovadorId == Guid.Empty)
                throw new ArgumentException("ID do usuário aprovador inválido.");

            var solicitacao = await _repository.GetByIdAsync(solicitacaoId);
            if (solicitacao == null)
                throw new KeyNotFoundException("Solicitação de produção não encontrada.");

            if (solicitacao.Status != StatusSolicitacaoProducao.Pendente)
                throw new InvalidOperationException($"Somente solicitações pendentes podem ser aprovadas. Status atual: {solicitacao.Status}.");

            try
            {
                solicitacao.Status = StatusSolicitacaoProducao.Aprovada;
                solicitacao.UsuarioAprovacaoId = usuarioAprovadorId;
                solicitacao.DataAprovacao = DateTime.UtcNow;

                if (!await _repository.UpdateAsync(solicitacao))
                {
                    throw new InvalidOperationException("Falha ao atualizar o status da solicitação.");
                }

                var ordensGeradas = new List<OrdemDeProducao>();
                foreach (var item in solicitacao.Itens)
                {
                    var novaOrdem = new OrdemDeProducao
                    {
                        CodigoOrdem = $"OP-{solicitacao.Id}-{item.ProdutoId}-{DateTime.UtcNow:yyyyMMddHHmmss}",
                        SolicitacaoProducaoId = solicitacao.Id,
                        ProdutoId = item.ProdutoId,
                        Quantidade = item.Quantidade,
                        TipoOrdemDeProducaoId = solicitacao.TipoOrdemDeProducaoId,
                        DataInicio = DateTime.UtcNow,
                        Status = StatusOrdemDeProducao.Ativa
                    };

                    
                    ordensGeradas.Add(await _ordemDeProducaoService.CreateAsync(novaOrdem, usuarioAprovadorId));
                }

                return ordensGeradas;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}