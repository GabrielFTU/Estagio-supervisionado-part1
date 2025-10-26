using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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

        public async Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordemDeProducao)
        {
            if (string.IsNullOrEmpty(ordemDeProducao.CodigoOrdem))
            {
                throw new ArgumentException("O código da Ordem de Produção é obrigatório.");
            }

            var produto = await _produtoRepository.GetByIdAsync(ordemDeProducao.ProdutoId);
            if (produto != null && produto.ControlarPorLote && ordemDeProducao.LoteId == null)
            {
                throw new ArgumentException("Este produto deve ser controlado por lote. 'LoteId' é obrigatório.");
            }
            ordemDeProducao.Status = StatusOrdemDeProducao.Ativa;
            ordemDeProducao.DataInicio = DateTime.UtcNow;

            var novaOrdem = await _repository.AddAsync(ordemDeProducao);
            var primeiraMovimentacao = new Movimentacao
            {
                OrdemDeProducaoId = novaOrdem.Id,
                AlmoxarifadoOrigemId = 1,
                AlmoxarifadoDestinoId = novaOrdem.AlmoxarifadoId,
                UsuarioId = 1,
                Observacoes = "Criação de O.P. e entrada inicial no rastreamento.",
                DataMovimentacao = DateTime.UtcNow
            };

            await _movimentacaoService.CreateAsync(primeiraMovimentacao);

            return novaOrdem;
        }

        public async Task<OrdemDeProducao?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<OrdemDeProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(OrdemDeProducao ordemDeProducao)
        {
            if (string.IsNullOrEmpty(ordemDeProducao.CodigoOrdem))
            {
                throw new ArgumentException("O código da Ordem de Produção é obrigatório.");
            }
            await _repository.UpdateAsync(ordemDeProducao);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}