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
                AlmoxarifadoOrigemId = produto.AlmoxarifadoEstoqueId ?? throw new InvalidOperationException("Almoxarifado de estoque do produto não definido."),
                AlmoxarifadoDestinoId = novaOrdem.AlmoxarifadoId
            };

            // Assumindo que o CreateAsync do MovimentacaoService foi atualizado para receber o DTO e o UsuarioId
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

        public async Task DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Ordem de Produção inválido.");
            }

            var existingOrder = await _repository.GetByIdAsync(id);
            if (existingOrder == null)
            {
                throw new KeyNotFoundException($"Ordem de Produção com ID {id} não encontrada para exclusão.");
            }

         
            if (existingOrder.Status == StatusOrdemDeProducao.Finalizada)
            {
                throw new InvalidOperationException($"Ordem de Produção {id} não pode ser excluída pois está finalizada.");
            }

            await _repository.DeleteAsync(id);
        }
    }
}