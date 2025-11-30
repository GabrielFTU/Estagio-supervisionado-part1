using Microsoft.EntityFrameworkCore;
using Valisys_Production.Data;
using Valisys_Production.DTOs;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        private readonly ILogSistemaService _logService; 

        public OrdemDeProducaoService(
            IOrdemDeProducaoRepository repository,
            IProdutoRepository produtoRepository,
            IMovimentacaoRepository movimentacaoRepository,
            IRoteiroProducaoRepository roteiroRepository,
            ILoteRepository loteRepository,
            ApplicationDbContext context,
            IAlmoxarifadoRepository almoxarifadoRepository,
            ILogSistemaService logService) 
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
            _movimentacaoRepository = movimentacaoRepository;
            _roteiroRepository = roteiroRepository;
            _loteRepository = loteRepository;
            _context = context;
            _almoxarifadoRepository = almoxarifadoRepository;
            _logService = logService;
        }
        private async Task<Almoxarifado> GetAlmoxarifadoPrincipalAsync()
        {
            var almoxarifados = await _almoxarifadoRepository.GetAllAsync();
            return almoxarifados.FirstOrDefault() ?? throw new InvalidOperationException("Nenhum almoxarifado cadastrado.");
        }

        public async Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordem, Guid usuarioId)
        {
            var anoAtual = DateTime.UtcNow.Year;
            var sequencial = await _repository.ObterProximoSequencialAsync(anoAtual);
            ordem.CodigoOrdem = $"OP-{anoAtual}-{sequencial:D4}";

            var produto = await _produtoRepository.GetByIdAsync(ordem.ProdutoId);
            if (produto == null) throw new KeyNotFoundException("Produto não encontrado.");
            if (produto.ControlarPorLote && ordem.LoteId == null) throw new ArgumentException("Produto exige lote.");

            var almoxarifadoMP = await GetAlmoxarifadoPrincipalAsync();
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
                    AlmoxarifadoOrigemId = almoxarifadoMP.Id,
                    AlmoxarifadoDestinoId = novaOrdem.AlmoxarifadoId,
                    UsuarioId = usuarioId,
                    DataMovimentacao = DateTime.UtcNow,
                    Observacoes = $"Início de Produção OP: {novaOrdem.CodigoOrdem}"
                };
                await _movimentacaoRepository.AddAsync(mov);
                await transaction.CommitAsync();

                await _logService.RegistrarAsync("Criação", "Produção", $"Iniciou a OP {novaOrdem.CodigoOrdem} para o produto {produto.Nome}", usuarioId);

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

            var almoxarifadoMP = await GetAlmoxarifadoPrincipalAsync();

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

                var mov = new Movimentacao
                {
                    ProdutoId = ordem.ProdutoId,
                    Quantidade = ordem.Quantidade,
                    OrdemDeProducaoId = ordem.Id,
                    AlmoxarifadoOrigemId = almoxarifadoMP.Id,
                    AlmoxarifadoDestinoId = ordem.AlmoxarifadoId,
                    UsuarioId = usuarioId,
                    DataMovimentacao = DateTime.UtcNow,
                    Observacoes = $"Finalização OP: {ordem.CodigoOrdem}"
                };
                await _movimentacaoRepository.AddAsync(mov);

                ordem.FaseAtual = null; ordem.Lote = null; ordem.Produto = null;
                ordem.Almoxarifado = null; ordem.RoteiroProducao = null;

                await _repository.UpdateAsync(ordem);
                await transaction.CommitAsync();
                await _logService.RegistrarAsync("Finalização", "Produção", $"Concluiu a produção da OP {ordem.CodigoOrdem}", usuarioId);
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
            
            var roteiro = await _roteiroRepository.GetByIdAsync(ordem.RoteiroProducaoId ?? Guid.Empty);
            if (roteiro == null) throw new InvalidOperationException("Roteiro inválido.");

            var etapas = roteiro.Etapas.OrderBy(e => e.Ordem).ToList();
            var etapaAtual = etapas.FirstOrDefault(e => e.FaseProducaoId == ordem.FaseAtualId);
            
            ordem.FaseAtual = null; ordem.Lote = null; ordem.Produto = null;

            if (etapaAtual == null)
            {
                ordem.FaseAtualId = etapas.First().FaseProducaoId;
                var res = await _repository.UpdateAsync(ordem);
                if(res) await _logService.RegistrarAsync("Movimentação", "Produção", $"Reiniciou fase da OP {ordem.CodigoOrdem}", usuarioId);
                return res;
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
                var res = await _repository.UpdateAsync(ordem);
                
                if(res) await _logService.RegistrarAsync("Movimentação", "Produção", $"Avançou OP {ordem.CodigoOrdem} para próxima fase", usuarioId);
                return res;
            }
        }

        public async Task TrocarFaseAsync(Guid ordemId, Guid novaFaseId)
        {
            var ordem = await _repository.GetByIdAsync(ordemId);
            if (ordem == null) throw new KeyNotFoundException("Ordem não encontrada.");

            var faseAnterior = ordem.FaseAtualId;
            ordem.FaseAtualId = novaFaseId;
            ordem.FaseAtual = null; ordem.Lote = null; ordem.Produto = null;

            await _repository.UpdateAsync(ordem);
            await _logService.RegistrarAsync("Movimentação Manual", "Produção", $"Moveu OP {ordem.CodigoOrdem} manualmente no Kanban");
        }

        public async Task<bool> UpdateAsync(OrdemDeProducao ordem)
        {
            var existing = await _repository.GetByIdAsync(ordem.Id);
            if (existing == null) throw new KeyNotFoundException("Ordem não encontrada.");
            
            await ValidarLoteUnicoAsync(ordem.LoteId, ordem.Id);

            existing.Quantidade = ordem.Quantidade;
            existing.Observacoes = ordem.Observacoes;
            existing.Status = ordem.Status;
            existing.AlmoxarifadoId = ordem.AlmoxarifadoId;
            
            if(ordem.LoteId.HasValue) existing.LoteId = ordem.LoteId;

            var updated = await _repository.UpdateAsync(existing);
            if (updated)
            {
                await _logService.RegistrarAsync("Edição", "Produção", $"Editou dados da OP {existing.CodigoOrdem}");
            }
            return updated;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var ordem = await _repository.GetByIdAsync(id);
            if (ordem == null) return false;

            var deleted = await _repository.DeleteAsync(id);
            if (deleted)
            {
                await _logService.RegistrarAsync("Exclusão", "Produção", $"Excluiu a OP {ordem.CodigoOrdem}");
            }
            return deleted;
        }

        public async Task<OrdemDeProducao?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);
        public async Task<OrdemDeProducao?> GetByCodigoAsync(string codigo) => await _repository.GetByCodigoAsync(codigo);
        public async Task<IEnumerable<OrdemDeProducao>> GetAllAsync() => await _repository.GetAllAsync();
        public async Task<IEnumerable<OrdemDeProducaoReadDto>> GetAllReadDtosAsync() => await _repository.GetAllReadDtosAsync();

        private async Task ValidarLoteUnicoAsync(Guid? loteId, Guid? ignoreId = null)
        {
            if (!loteId.HasValue) return;
            var emUso = await _context.OrdensDeProducao.AnyAsync(o => o.LoteId == loteId && o.Id != ignoreId && o.Status != StatusOrdemDeProducao.Finalizada && o.Status != StatusOrdemDeProducao.Cancelada);
            if (emUso) throw new InvalidOperationException("Lote já está em uso em outra OP.");
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
                throw new InvalidOperationException("Produto sem roteiro definido. Selecione a fase manualmente.");
            }
        }
    }
}