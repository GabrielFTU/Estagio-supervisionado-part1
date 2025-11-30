using Valisys_Production.Models;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Repositories.Interfaces;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Valisys_Production.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _repository;
        private readonly ILogSistemaService _logService; 

        public ProdutoService(IProdutoRepository repository, ILogSistemaService logService)
        {
            _repository = repository;
            _logService = logService;
        }

        public async Task<Produto> CreateAsync(Produto produto)
        {
            if (string.IsNullOrEmpty(produto.Nome))
            {
                throw new ArgumentException("O nome do produto não pode ser vazio.");
            }

            produto.CodigoInternoProduto = await GerarProximoCodigoSequencialAsync();
            produto.DataCadastro = DateTime.UtcNow;
            
            var novoProduto = await _repository.AddAsync(produto);

            await _logService.RegistrarAsync(
                "Criação", 
                "Produtos", 
                $"Criou o produto '{novoProduto.Nome}' (Cód: {novoProduto.CodigoInternoProduto})"
            );

            return novoProduto;
        }

        private async Task<string> GerarProximoCodigoSequencialAsync()
        {
            var produtos = await _repository.GetAllAsync();

            var codigosNumericos = produtos
                .Select(p => p.CodigoInternoProduto)
                .Where(c => int.TryParse(c, out _)) 
                .Select(c => int.Parse(c))
                .ToList();

            int proximoNumero = 1;

            if (codigosNumericos.Any())
            {
                proximoNumero = codigosNumericos.Max() + 1;
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

            var updated = await _repository.UpdateAsync(produto);

            if (updated)
            {
                await _logService.RegistrarAsync(
                    "Edição", 
                    "Produtos", 
                    $"Editou o produto '{produto.Nome}' (ID: {produto.Id})"
                );
            }

            return updated;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existingProduto = await _repository.GetByIdAsync(id);
            if (existingProduto == null) return false;
            
            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                await _logService.RegistrarAsync(
                    "Exclusão", 
                    "Produtos", 
                    $"Inativou/Excluiu o produto '{existingProduto.Nome}'"
                );
            }

            return deleted;
        }
    }
}