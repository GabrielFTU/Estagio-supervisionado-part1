using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.DTOs;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class OrdemDeProducaoService : IOrdemDeProducaoService
    {
        private readonly IOrdemDeProducaoRepository _repository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IMovimentacaoRepository _movimentacaoRepository;
        private readonly IRoteiroProducaoRepository _roteiroRepository;
        private readonly ILoteRepository _loteRepository;
        private readonly ApplicationDbContext _context;
        private readonly IAlmoxarifadoRepository _almoxarifadoRepository;

        public OrdemDeProducaoService(
            IOrdemDeProducaoRepository repository,
            IProdutoRepository produtoRepository,
            IMovimentacaoRepository movimentacaoRepository,
            IRoteiroProducaoRepository roteiroRepository,
            ILoteRepository loteRepository,
            ApplicationDbContext context,
            IAlmoxarifadoRepository almoxarifadoRepository)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
            _movimentacaoRepository = movimentacaoRepository;
            _roteiroRepository = roteiroRepository;
            _loteRepository = loteRepository;
            _context = context;
            _almoxarifadoRepository = almoxarifadoRepository;
        }

        private async Task<Almoxarifado> GetAlmoxarifadoPrincipalAsync()
        {
            var almoxarifados = await _almoxarifadoRepository.GetAllAsync();
            var principal = almoxarifados.FirstOrDefault(a => a.Nome.Contains("Geral") || a.Nome.Contains("Principal"));
            if (principal == null) principal = almoxarifados.FirstOrDefault();
            if (principal == null) throw new InvalidOperationException("Nenhum almoxarifado encontrado no sistema.");
            return principal;
        }

        public async Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordem, Guid usuarioId)
        {
            var anoAtual = DateTime.UtcNow.Year;
            var sequencial = await _repository.ObterProximoSequencialAsync(anoAtual);

            ordem.CodigoOrdem = $"OP-{anoAtual}-{sequencial:D4}";

            var produto = await _produtoRepository.GetByIdAsync(ordem.ProdutoId);
            if (produto == null) throw new KeyNotFoundException("Produto não encontrado.");

            if (produto.ControlarPorLote && ordem.LoteId == null) throw new ArgumentException("Produto exige controle por lote.");

            var almoxarifadoMateriaPrima = await GetAlmoxarifadoPrincipalAsync();

            await ValidarLoteUnicoAsync(ordem.LoteId);
            await ConfigurarRoteiroInicialAsync(ordem);

            ordem.Status = StatusOrdemDeProducao.Ativa;
            ordem.DataInicio = DateTime.UtcNow;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var novaOrdem = await _repository.AddAsync(ordem);

                if (novaOrdem.LoteId.HasValue)
                {
                    var lote = await _loteRepository.GetByIdAsync(novaOrdem.LoteId.Value);
                    if (lote != null)
                    {
                        lote.statusLote = StatusLote.EmProducao;
                        await _loteRepository.UpdateAsync(lote);
                    }
                }

                var mov = new Movimentacao
                {
                    ProdutoId = novaOrdem.ProdutoId,
                    Quantidade = novaOrdem.Quantidade,
                    OrdemDeProducaoId = novaOrdem.Id,
                    AlmoxarifadoOrigemId = almoxarifadoMateriaPrima.Id,
                    AlmoxarifadoDestinoId = novaOrdem.AlmoxarifadoId,
                    UsuarioId = usuarioId,
                    DataMovimentacao = DateTime.UtcNow,
                    Observacoes = $"Início de Produção OP: {novaOrdem.CodigoOrdem}"
                };

                await _movimentacaoRepository.AddAsync(mov);
                await transaction.CommitAsync();

                return novaOrdem;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task FinalizarOrdemAsync(Guid ordemId, Guid usuarioId)
        {
            var ordem = await _repository.GetByIdAsync(ordemId);
            if (ordem == null) throw new KeyNotFoundException("Ordem não encontrada.");

            if (ordem.Status == StatusOrdemDeProducao.Finalizada) return;

            if (ordem.Status != StatusOrdemDeProducao.Ativa && ordem.Status != StatusOrdemDeProducao.Aguardando)
                throw new InvalidOperationException($"Status inválido para finalização: {ordem.Status}");

            var almoxarifadoMateriaPrima = await GetAlmoxarifadoPrincipalAsync();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                ordem.Status = StatusOrdemDeProducao.Finalizada;
                ordem.DataFim = DateTime.UtcNow;

                if (ordem.LoteId.HasValue)
                {
                    var lote = await _loteRepository.GetByIdAsync(ordem.LoteId.Value);
                    if (lote != null)
                    {
                        lote.statusLote = StatusLote.Concluido;
                        lote.DataConclusao = DateTime.UtcNow;
                        await _loteRepository.UpdateAsync(lote);
                    }
                }

                var movEntrada = new Movimentacao
                {
                    ProdutoId = ordem.ProdutoId,
                    Quantidade = ordem.Quantidade,
                    OrdemDeProducaoId = ordem.Id,
                    AlmoxarifadoOrigemId = almoxarifadoMateriaPrima.Id,
                    AlmoxarifadoDestinoId = ordem.AlmoxarifadoId,
                    UsuarioId = usuarioId,
                    DataMovimentacao = DateTime.UtcNow,
                    Observacoes = $"Finalização OP: {ordem.CodigoOrdem}"
                };
                await _movimentacaoRepository.AddAsync(movEntrada);

                ordem.Lote = null;
                ordem.FaseAtual = null;
                ordem.Produto = null;
                ordem.Almoxarifado = null;
                ordem.RoteiroProducao = null;
                ordem.TipoOrdemDeProducao = null;
                ordem.SolicitacaoProducao = null;

                await _repository.UpdateAsync(ordem);

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> MovimentarProximaFaseAsync(Guid ordemId, Guid usuarioId)
        {
            var ordem = await _repository.GetByIdAsync(ordemId);
            if (ordem == null) throw new KeyNotFoundException("Ordem não encontrada.");
            if (ordem.RoteiroProducaoId == null) throw new InvalidOperationException("Roteiro não encontrado.");

            var roteiro = await _roteiroRepository.GetByIdAsync(ordem.RoteiroProducaoId.Value);
            var etapas = roteiro.Etapas.OrderBy(e => e.Ordem).ToList();

            var etapaAtual = etapas.FirstOrDefault(e => e.FaseProducaoId == ordem.FaseAtualId);

            ordem.FaseAtual = null;
            ordem.Lote = null;
            ordem.Produto = null;

            if (etapaAtual == null)
            {
                ordem.FaseAtualId = etapas.First().FaseProducaoId;
                return await _repository.UpdateAsync(ordem);
            }
            else
            {
                var index = etapas.IndexOf(etapaAtual);

                if (index >= etapas.Count - 1)
                {
                    await FinalizarOrdemAsync(ordemId, usuarioId);
                    return true;
                }

                ordem.FaseAtualId = etapas[index + 1].FaseProducaoId;
                return await _repository.UpdateAsync(ordem);
            }
        }

        public async Task TrocarFaseAsync(Guid ordemId, Guid novaFaseId)
        {
            var ordem = await _repository.GetByIdAsync(ordemId);
            if (ordem == null) throw new KeyNotFoundException("Ordem não encontrada.");

            ordem.FaseAtualId = novaFaseId;

            ordem.FaseAtual = null;
            ordem.Lote = null;
            ordem.Produto = null;

            await _repository.UpdateAsync(ordem);
        }

        public async Task<bool> UpdateAsync(OrdemDeProducao ordem)
        {
            var existing = await _repository.GetByIdAsync(ordem.Id);
            if (existing == null) throw new KeyNotFoundException("Ordem não encontrada.");

            await ValidarLoteUnicoAsync(ordem.LoteId, ordem.Id);

            existing.CodigoOrdem = ordem.CodigoOrdem;
            existing.Quantidade = ordem.Quantidade;
            existing.Observacoes = ordem.Observacoes;
            existing.AlmoxarifadoId = ordem.AlmoxarifadoId;
            existing.TipoOrdemDeProducaoId = ordem.TipoOrdemDeProducaoId;
            existing.Status = ordem.Status;

            if (ordem.LoteId.HasValue) existing.LoteId = ordem.LoteId;

            if (ordem.FaseAtualId != Guid.Empty && ordem.FaseAtualId != existing.FaseAtualId)
            {
                existing.FaseAtualId = ordem.FaseAtualId;
                existing.FaseAtual = null;
            }

            return await _repository.UpdateAsync(existing);
        }

        public async Task<OrdemDeProducao?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);
        public async Task<OrdemDeProducao?> GetByCodigoAsync(string codigo) => await _repository.GetByCodigoAsync(codigo);
        public async Task<IEnumerable<OrdemDeProducao>> GetAllAsync() => await _repository.GetAllAsync();
        public async Task<IEnumerable<OrdemDeProducaoReadDto>> GetAllReadDtosAsync() => await _repository.GetAllReadDtosAsync();
        public async Task<bool> DeleteAsync(Guid id) => await _repository.DeleteAsync(id);

        private async Task ValidarLoteUnicoAsync(Guid? loteId, Guid? ignoreId = null)
        {
            if (!loteId.HasValue) return;
            var emUso = await _context.OrdensDeProducao
                .AnyAsync(o => o.LoteId == loteId && o.Id != ignoreId && o.Status != StatusOrdemDeProducao.Cancelada && o.Status != StatusOrdemDeProducao.Finalizada);
            if (emUso) throw new InvalidOperationException("Lote já vinculado a outra OP ativa.");
        }

        private async Task ConfigurarRoteiroInicialAsync(OrdemDeProducao ordem)
        {
            var roteiros = await _roteiroRepository.GetAllAsync();
            var roteiro = roteiros.FirstOrDefault(r => r.ProdutoId == ordem.ProdutoId && r.Ativo);

            if (roteiro != null && roteiro.Etapas.Any())
            {
                ordem.RoteiroProducaoId = roteiro.Id;
                ordem.FaseAtualId = roteiro.Etapas.OrderBy(e => e.Ordem).First().FaseProducaoId;
            }
            else if (ordem.FaseAtualId == Guid.Empty)
            {
                throw new InvalidOperationException("Produto sem roteiro. Selecione a fase inicial manualmente.");
            }
        }
    }
}