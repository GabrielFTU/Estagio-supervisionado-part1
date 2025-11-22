using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Repositories.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Valisys_Production.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _repository;

        public ProdutoService(IProdutoRepository repository)
        {
            _repository = repository;
        }

        public async Task<Produto> CreateAsync(Produto produto)
        {
            if (string.IsNullOrEmpty(produto.Nome))
            {
                throw new ArgumentException("O nome do produto não pode ser vazio.");
            }

            produto.CodigoInternoProduto = await GerarProximoCodigoSequencialAsync();

            produto.DataCadastro = DateTime.UtcNow;
            return await _repository.AddAsync(produto);
        }

        private async Task<string> GerarProximoCodigoSequencialAsync()
        {
            var produtos = await _repository.GetAllAsync();

            var codigosExistentes = produtos
                .Select(p => p.CodigoInternoProduto)
                .Where(c => int.TryParse(c, out _)) 
                .Select(c => int.Parse(c))
                .ToList();

            int proximoNumero = 1; 

            if (codigosExistentes.Any())
            {
                proximoNumero = codigosExistentes.Max() + 1;
            }

            return proximoNumero.ToString("D4");
        }

        public async Task<Produto?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(Produto produto)
        {
            if (produto.Id == Guid.Empty) throw new ArgumentException("ID ausente.");

            var existingProduto = await _repository.GetByIdAsync(produto.Id);
            if (existingProduto == null) throw new KeyNotFoundException("Produto não encontrado.");

            produto.CodigoInternoProduto = existingProduto.CodigoInternoProduto;
            produto.DataCadastro = existingProduto.DataCadastro;

            return await _repository.UpdateAsync(produto);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existingProduto = await _repository.GetByIdAsync(id);
            if (existingProduto == null) return false;
            return await _repository.DeleteAsync(id);
        }
    }
}