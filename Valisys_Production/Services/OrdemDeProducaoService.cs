using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly IMovimentacaoService _movimentacaoService;
        private readonly IRoteiroProducaoRepository _roteiroRepository;

        private readonly Guid AlmoxarifadoMateriaPrimaPadraoId = Guid.Parse("C0DE0000-0000-0000-0000-000000000009");

        public OrdemDeProducaoService(
            IOrdemDeProducaoRepository repository,
            IProdutoRepository produtoRepository,
            IMovimentacaoService movimentacaoService,
            IRoteiroProducaoRepository roteiroRepository)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
            _movimentacaoService = movimentacaoService;
            _roteiroRepository = roteiroRepository;
        }

        private async Task ValidarLoteUnicoAsync(Guid? loteId, Guid? ordemIdIgnorar = null)
        {
            if (loteId.HasValue)
            {
                var ordens = await _repository.GetAllAsync();
                var usoExistente = ordens.FirstOrDefault(o =>
                    o.LoteId == loteId.Value &&
                    o.Id != ordemIdIgnorar &&
                    o.Status != StatusOrdemDeProducao.Cancelada
                );

                if (usoExistente != null)
                {
                    throw new InvalidOperationException($"O Lote informado já está em uso na OP {usoExistente.CodigoOrdem}.");
                }
            }
        }

        public async Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordemDeProducao, Guid usuarioId)
        {
            if (ordemDeProducao == null) throw new ArgumentNullException(nameof(ordemDeProducao));

            if (string.IsNullOrEmpty(ordemDeProducao.CodigoOrdem))
                throw new ArgumentException("O código da Ordem de Produção é obrigatório.");

            var produto = await _produtoRepository.GetByIdAsync(ordemDeProducao.ProdutoId);
            if (produto == null)
                throw new KeyNotFoundException($"Produto com ID {ordemDeProducao.ProdutoId} não encontrado.");

            if (produto.ControlarPorLote && ordemDeProducao.LoteId == null)
                throw new ArgumentException("Este produto exige controle por lote. 'LoteId' é obrigatório.");

            await ValidarLoteUnicoAsync(ordemDeProducao.LoteId);

            var roteiros = await _roteiroRepository.GetAllAsync();
            var roteiroAtivo = roteiros.FirstOrDefault(r => r.ProdutoId == ordemDeProducao.ProdutoId && r.Ativo);

            if (roteiroAtivo != null)
            {
                ordemDeProducao.RoteiroProducaoId = roteiroAtivo.Id;
                var primeiraEtapa = roteiroAtivo.Etapas.OrderBy(e => e.Ordem).FirstOrDefault();

                if (primeiraEtapa != null)
                {
                    ordemDeProducao.FaseAtualId = primeiraEtapa.FaseProducaoId;
                }
                else
                {
                    throw new InvalidOperationException("O roteiro vinculado não possui etapas.");
                }
            }
            else if (ordemDeProducao.FaseAtualId == Guid.Empty)
            {
                throw new InvalidOperationException("Nenhum Roteiro ativo encontrado. Selecione a Fase Inicial manualmente.");
            }

            ordemDeProducao.Status = StatusOrdemDeProducao.Ativa;
            ordemDeProducao.DataInicio = DateTime.UtcNow;
            ordemDeProducao.Observacoes = ordemDeProducao.Observacoes ?? string.Empty;

            var novaOrdem = await _repository.AddAsync(ordemDeProducao);

            var primeiraMovimentacaoDto = new MovimentacaoCreateDto
            {
                ProdutoId = novaOrdem.ProdutoId,
                Quantidade = novaOrdem.Quantidade,
                OrdemDeProducaoId = novaOrdem.Id,
                AlmoxarifadoOrigemId = AlmoxarifadoMateriaPrimaPadraoId,
                AlmoxarifadoDestinoId = novaOrdem.AlmoxarifadoId
            };

            await _movimentacaoService.CreateAsync(primeiraMovimentacaoDto, usuarioId);

            return novaOrdem;
        }

        public async Task<OrdemDeProducao?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);

        public async Task<OrdemDeProducao?> GetByCodigoAsync(string codigo)
        {
            if (string.IsNullOrWhiteSpace(codigo)) return null;
            return await _repository.GetByCodigoAsync(codigo);
        }

        public async Task<IEnumerable<OrdemDeProducao>> GetAllAsync() => await _repository.GetAllAsync();

        public async Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao)
        {
            if (ordemDeProducao == null || ordemDeProducao.Id == Guid.Empty)
                throw new ArgumentException("Dados inválidos.");

            var existingOrder = await _repository.GetByIdAsync(ordemDeProducao.Id);
            if (existingOrder == null)
                throw new KeyNotFoundException("OP não encontrada.");

            await ValidarLoteUnicoAsync(ordemDeProducao.LoteId, ordemDeProducao.Id);

            ordemDeProducao.DataInicio = existingOrder.DataInicio;
            ordemDeProducao.RoteiroProducaoId = existingOrder.RoteiroProducaoId;
            ordemDeProducao.SolicitacaoProducaoId = existingOrder.SolicitacaoProducaoId;
            ordemDeProducao.DataFim = existingOrder.DataFim;

            ordemDeProducao.Observacoes = ordemDeProducao.Observacoes ?? string.Empty;

            return await _repository.UpdateAsync(ordemDeProducao);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existingOrder = await _repository.GetByIdAsync(id);
            if (existingOrder == null) return false;

            if (existingOrder.Status == StatusOrdemDeProducao.Finalizada)
                throw new InvalidOperationException("OP finalizada não pode ser excluída.");

            return await _repository.DeleteAsync(id);
        }
        public async Task<bool> MovimentarProximaFaseAsync(Guid ordemId)
        {
            var ordem = await _repository.GetByIdAsync(ordemId);
            if (ordem == null) throw new KeyNotFoundException("Ordem de Produção não encontrada.");

            if (ordem.RoteiroProducaoId == null)
                throw new InvalidOperationException("Esta Ordem não possui um Roteiro vinculado.");

            var roteiro = await _roteiroRepository.GetByIdAsync(ordem.RoteiroProducaoId.Value);
            if (roteiro == null) throw new InvalidOperationException("Roteiro de Produção não encontrado.");

            var etapasOrdenadas = roteiro.Etapas.OrderBy(e => e.Ordem).ToList();
            var etapaAtual = etapasOrdenadas.FirstOrDefault(e => e.FaseProducaoId == ordem.FaseAtualId);

            if (etapaAtual == null)
            {
                ordem.FaseAtualId = etapasOrdenadas.First().FaseProducaoId;
            }
            else
            {
                var indexAtual = etapasOrdenadas.IndexOf(etapaAtual);
                if (indexAtual < etapasOrdenadas.Count - 1)
                {
                    ordem.FaseAtualId = etapasOrdenadas[indexAtual + 1].FaseProducaoId;
                }
                else
                {
                    throw new InvalidOperationException("A produção já está na última fase.");
                }
            }

            ordem.FaseAtual = null;
            ordem.RoteiroProducao = null;
            ordem.Produto = null;
            ordem.Almoxarifado = null;
            ordem.Lote = null;
            ordem.TipoOrdemDeProducao = null;

            return await _repository.UpdateAsync(ordem);
        }
        public async Task TrocarFaseAsync(Guid ordemId, Guid novaFaseId)
        {
            var ordem = await _repository.GetByIdAsync(ordemId);
            if (ordem == null) throw new KeyNotFoundException("Ordem não encontrada.");


            if (ordem.RoteiroProducaoId.HasValue)
            {
                var roteiro = await _roteiroRepository.GetByIdAsync(ordem.RoteiroProducaoId.Value);
                if (roteiro != null && !roteiro.Etapas.Any(e => e.FaseProducaoId == novaFaseId))
                {
                    throw new InvalidOperationException("Esta fase não pertence ao Roteiro de Produção deste produto.");
                }
            }

            ordem.FaseAtualId = novaFaseId;
            ordem.FaseAtual = null;
            ordem.RoteiroProducao = null;
            ordem.Produto = null;
            ordem.Almoxarifado = null;
            ordem.Lote = null;
            ordem.TipoOrdemDeProducao = null;

            await _repository.UpdateAsync(ordem);
        }
        public async Task FinalizarOrdemAsync(Guid ordemId, Guid usuarioId)
        {
            var ordem = await _repository.GetByIdAsync(ordemId);
            if (ordem == null) throw new KeyNotFoundException("Ordem de Produção não encontrada.");

            if (ordem.Status == StatusOrdemDeProducao.Finalizada)
                throw new InvalidOperationException("Esta ordem já está finalizada.");

            if (ordem.Status == StatusOrdemDeProducao.Cancelada)
                throw new InvalidOperationException("Não é possível finalizar uma ordem cancelada.");

            ordem.Status = StatusOrdemDeProducao.Finalizada;
            ordem.DataFim = DateTime.UtcNow;

            if (ordem.Lote != null)
            {
                ordem.Lote.statusLote = StatusLote.Concluido;
                ordem.Lote.DataConclusao = DateTime.UtcNow;
            }

            var movimentacaoEntrada = new MovimentacaoCreateDto
            {
                ProdutoId = ordem.ProdutoId,
                Quantidade = ordem.Quantidade,
                OrdemDeProducaoId = ordem.Id,
                AlmoxarifadoOrigemId = AlmoxarifadoMateriaPrimaPadraoId,
                AlmoxarifadoDestinoId = ordem.AlmoxarifadoId
            };

            await _movimentacaoService.CreateAsync(movimentacaoEntrada, usuarioId);

            ordem.FaseAtual = null;
            ordem.RoteiroProducao = null;
            ordem.Produto = null;
            ordem.Almoxarifado = null;
            ordem.TipoOrdemDeProducao = null;
           

            await _repository.UpdateAsync(ordem);
        }
    }
}