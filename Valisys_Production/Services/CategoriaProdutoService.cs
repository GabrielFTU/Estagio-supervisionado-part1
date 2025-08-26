// Services/CategoriaProdutoService.cs

using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Valisys_Production.Services
{
    public class CategoriaProdutoService : ICategoriaProdutoService
    {
        private readonly ICategoriaProdutoRepository _repository;

        public CategoriaProdutoService(ICategoriaProdutoRepository repository)
        {
            _repository = repository;
        }

        public async Task<CategoriaProduto> CreateAsync(CategoriaProduto categoriaProduto)
        {
            if (string.IsNullOrEmpty(categoriaProduto.Nome))
            {
                throw new ArgumentException("O nome da categoria é obrigatório.");
            }
            return await _repository.AddAsync(categoriaProduto);
        }

        public async Task<CategoriaProduto?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<CategoriaProduto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task UpdateAsync(CategoriaProduto categoriaProduto)
        {
            if (string.IsNullOrEmpty(categoriaProduto.Nome))
            {
                throw new ArgumentException("O nome da categoria é obrigatório.");
            }
            await _repository.UpdateAsync(categoriaProduto);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}