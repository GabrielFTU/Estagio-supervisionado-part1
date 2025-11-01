using System;
using System.Collections.Generic;
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

        private readonly Guid AlmoxarifadoMateriaPrimaPadraoId = Guid.Parse("C0DE0000-0000-0000-0000-000000000001");

        public OrdemDeProducaoService(IOrdemDeProducaoRepository repository, IProdutoRepository produtoRepository, IMovimentacaoService movimentacaoService)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
            _movimentacaoService = movimentacaoService;
        }

        public async Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordemDeProducao, Guid usuarioId)
        {
            if (ordemDeProducao == null)
            {
                throw new ArgumentNullException(nameof(ordemDeProducao));
            }

            if (string.IsNullOrEmpty(ordemDeProducao.CodigoOrdem))
            {
                throw new ArgumentException("O código da Ordem de Produção é obrigatório.");
            }

            var produto = await _produtoRepository.GetByIdAsync(ordemDeProducao.ProdutoId);
            if (produto == null)
            {
                throw new KeyNotFoundException($"Produto com ID {ordemDeProducao.ProdutoId} não encontrado.");
            }

            if (produto.ControlarPorLote && ordemDeProducao.LoteId == null)
            {
                throw new ArgumentException("Este produto exige controle por lote. 'LoteId' é obrigatório.");
            }

            ordemDeProducao.Status = StatusOrdemDeProducao.Ativa;
            ordemDeProducao.DataInicio = DateTime.UtcNow;

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

        public async Task<OrdemDeProducao?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Ordem de Produção inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<OrdemDeProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(OrdemDeProducao ordemDeProducao)
        {
            if (ordemDeProducao == null || ordemDeProducao.Id == Guid.Empty)
            {
                throw new ArgumentException("Dados da Ordem de Produção inválidos ou ID ausente.");
            }

            var existingOrder = await _repository.GetByIdAsync(ordemDeProducao.Id);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException($"Ordem de Produção com ID {ordemDeProducao.Id} não encontrada.");
            }

            if (string.IsNullOrEmpty(ordemDeProducao.CodigoOrdem))
            {
                throw new ArgumentException("O código da Ordem de Produção é obrigatório.");
            }
            return await _repository.UpdateAsync(ordemDeProducao);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Ordem de Produção inválido.");
            }

            var existingOrder = await _repository.GetByIdAsync(id);
            if (existingOrder == null)
            {
                return false;
            }

            if (existingOrder.Status == StatusOrdemDeProducao.Finalizada)
            {
                throw new InvalidOperationException($"Ordem de Produção {id} não pode ser excluída pois está finalizada.");
            }

            return await _repository.DeleteAsync(id);
        }
    }
}