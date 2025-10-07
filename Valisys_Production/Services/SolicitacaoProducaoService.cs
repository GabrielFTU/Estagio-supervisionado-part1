using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;

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

        public async Task<SolicitacaoProducao?> GetByIdAsync(int id) =>
            await _repository.GetByIdAsync(id);

        public async Task<IEnumerable<SolicitacaoProducao>> GetAllAsync() =>
            await _repository.GetAllAsync();

        public async Task UpdateAsync(SolicitacaoProducao solicitacaoProducao) =>
            await _repository.UpdateAsync(solicitacaoProducao);

        public async Task DeleteAsync(int id) =>
            await _repository.DeleteAsync(id);

        public async Task<List<OrdemDeProducao>> AprovarSolicitacaoAsync(int solicitacaoId, int usuarioAprovadorId)
        {
            var solicitacao = await _repository.GetByIdAsync(solicitacaoId);
            if (solicitacao == null)
                throw new KeyNotFoundException("Solicitação de produção não encontrada.");

            if (solicitacao.Status != StatusSolicitacaoProducao.Pendente)
                throw new InvalidOperationException("Somente solicitações pendentes podem ser aprovadas.");

            solicitacao.Status = StatusSolicitacaoProducao.Aprovada;
            solicitacao.UsuarioAprovacaoId = usuarioAprovadorId;
            solicitacao.DataAprovacao = DateTime.UtcNow;
            await _repository.UpdateAsync(solicitacao);

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
                ordensGeradas.Add(await _ordemDeProducaoService.CreateAsync(novaOrdem));
            }
            return ordensGeradas;
        }
    }
}