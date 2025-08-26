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

        public OrdemDeProducaoService(IOrdemDeProducaoRepository repository, IProdutoRepository produtoRepository)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
        }

        public async Task<OrdemDeProducao> CreateAsync(OrdemDeProducao ordemDeProducao)
        {
            // Validações básicas
            if (string.IsNullOrEmpty(ordemDeProducao.CodigoOrdem))
            {
                throw new ArgumentException("O código da Ordem de Produção é obrigatório.");
            }

            // Lógica de negócio: Verificar a regra de lote
            var produto = await _produtoRepository.GetByIdAsync(ordemDeProducao.ProdutoId);
            if (produto != null && produto.ControlarPorLote && ordemDeProducao.LoteId == null)
            {
                throw new ArgumentException("Este produto deve ser controlado por lote. 'LoteId' é obrigatório.");
            }

            // Define o status inicial e as datas
            ordemDeProducao.Status = StatusOrdemDeProducao.Ativa;
            ordemDeProducao.DataInicio = DateTime.UtcNow;

            return await _repository.AddAsync(ordemDeProducao);
        }

        public async Task<OrdemDeProducao?> GetByIdAsync(int id)
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

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}