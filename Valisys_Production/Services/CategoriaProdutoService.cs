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

        public async Task<CategoriaProduto?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Categoria de Produto inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<CategoriaProduto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(CategoriaProduto categoriaProduto)
        {
            if (categoriaProduto.Id == Guid.Empty)
            {
                throw new ArgumentException("ID da Categoria de Produto ausente para atualização.");
            }
            if (string.IsNullOrEmpty(categoriaProduto.Nome))
            {
                throw new ArgumentException("O nome da categoria é obrigatório.");
            }

            var existingCategoria = await _repository.GetByIdAsync(categoriaProduto.Id);
            if (existingCategoria == null)
            {
                throw new KeyNotFoundException($"Categoria de Produto com ID {categoriaProduto.Id} não encontrada.");
            }

      
            return await _repository.UpdateAsync(categoriaProduto);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da Categoria de Produto inválido para exclusão.");
            }

            var existingCategoria = await _repository.GetByIdAsync(id);
            if (existingCategoria == null)
            {
                return false;
            }
    
            return await _repository.DeleteAsync(id);
        }
    }
}