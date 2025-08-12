using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class FornecedorService : IFornecedorService
    {
        private readonly IFornecedorRepository _repository;

        public FornecedorService(IFornecedorRepository fornecedorRepository)
        {
            _repository = fornecedorRepository;
        }

        public async Task<Fornecedor> CreateAsync(Fornecedor fornecedor) 
        {
            if(string.IsNullOrEmpty(fornecedor.Nome))
            {
                throw new ArgumentException("Nome do fornecedor não pode estar vazio.");
            }
            fornecedor.DataCadastro = DateTime.UtcNow;
            return await _repository.AddAsync(fornecedor);
        }
        public async Task<Fornecedor> GetByIdAsync(int id)
        { 
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Fornecedor>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task UpdateAsync(Fornecedor fornecedor)
        {
            if (string.IsNullOrEmpty(fornecedor.Nome))
            {
                throw new ArgumentException("Nome do fornecedor não pode estar vazio.");
            }
            await _repository.UpdateAsync(fornecedor);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}