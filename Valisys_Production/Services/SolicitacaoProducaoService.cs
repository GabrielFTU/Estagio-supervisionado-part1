using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services
{
    public class SolicitacaoProducaoService : ISolicitacaoProducaoService
    {
        private readonly ISolicitacaoProducaoRepository _repository;
        private readonly IProdutoRepository _produtoRepository; 

        public SolicitacaoProducaoService(ISolicitacaoProducaoRepository repository, IProdutoRepository produtoRepository)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
        }

        public async Task<SolicitacaoProducao> CreateAsync(SolicitacaoProducao solicitacaoProducao)
        {
            solicitacaoProducao.Status = StatusSolicitacaoProducao.Pendente;
            solicitacaoProducao.DataSolicitacao = DateTime.UtcNow;

            return await _repository.AddAsync(solicitacaoProducao);
        }

        public async Task<SolicitacaoProducao?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<SolicitacaoProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(SolicitacaoProducao solicitacaoProducao)
        {
            await _repository.UpdateAsync(solicitacaoProducao);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}