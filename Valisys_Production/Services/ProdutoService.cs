using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Valisys_Production.Repositories.Interfaces;

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
                throw new ArgumentException ("O nome do produto não pode ser vazio.");
            }
            produto.DataCadastro = DateTime.Now;
            return await _repository.AddAsync(produto); 
        }
        public async Task<Produto> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task UpdateAsync(Produto produto)
        {
            if(string.IsNullOrEmpty(produto.Nome))
            {
                throw new ArgumentException("O nome do produto não pode ser vazio.");
            }
            await _repository.UpdateAsync(produto);
        }
        public async Task DeleteAsync(int id)
        {
            var produto = await _repository.GetByIdAsync(id);
            if (produto == null)
            {
                throw new KeyNotFoundException("Produto não encontrado.");
            }
            await _repository.DeleteAsync(id);
        }
    }
}
