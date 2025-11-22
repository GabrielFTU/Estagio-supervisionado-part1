using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

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

            categoriaProduto.Codigo = await GerarProximoCodigoAsync();

            return await _repository.AddAsync(categoriaProduto);
        }

        private async Task<string> GerarProximoCodigoAsync()
        {
            var categorias = await _repository.GetAllAsync();

            var codigosNumericos = categorias
                .Select(c => c.Codigo)
                .Where(c => int.TryParse(c, out _))
                .Select(c => int.Parse(c))
                .ToList();

            int proximo = 1;
            if (codigosNumericos.Any())
            {
                proximo = codigosNumericos.Max() + 1;
            }

            return proximo.ToString("D3");
        }

        public async Task<CategoriaProduto?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<CategoriaProduto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(CategoriaProduto categoriaProduto)
        {
            if (categoriaProduto.Id == Guid.Empty) throw new ArgumentException("ID ausente.");

            var existing = await _repository.GetByIdAsync(categoriaProduto.Id);
            if (existing == null) throw new KeyNotFoundException("Categoria não encontrada.");

            categoriaProduto.Codigo = existing.Codigo;

            return await _repository.UpdateAsync(categoriaProduto);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.DeleteAsync(id);
        }
    }
}