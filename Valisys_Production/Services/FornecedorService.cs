using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class FornecedorService : IFornecedorService
    {
        private readonly IFornecedorRepository _repository;
        private readonly ILogSistemaService _logService;

        public FornecedorService(IFornecedorRepository fornecedorRepository, ILogSistemaService logService)
        {
            _repository = fornecedorRepository;
            _logService = logService;
        }

        public async Task<Fornecedor> CreateAsync(Fornecedor fornecedor)
        {
            if (string.IsNullOrEmpty(fornecedor.Nome))
                throw new ArgumentException("Nome do fornecedor não pode estar vazio.");
            
            fornecedor.DataCadastro = DateTime.UtcNow;
            var created = await _repository.AddAsync(fornecedor);

            await _logService.RegistrarAsync("Criação", "Fornecedores", $"Cadastrou o fornecedor '{created.Nome}' (Doc: {created.Documento})");

            return created;
        }

        public async Task<Fornecedor?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty) throw new ArgumentException("ID inválido.");
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Fornecedor>> GetAllAsync() => await _repository.GetAllAsync();

        public async Task<bool> UpdateAsync(Fornecedor fornecedor)
        {
            if (fornecedor.Id == Guid.Empty) throw new ArgumentException("ID ausente.");
            
            var existing = await _repository.GetByIdAsync(fornecedor.Id);
            if (existing == null) throw new KeyNotFoundException("Fornecedor não encontrado.");

            var result = await _repository.UpdateAsync(fornecedor);

            if (result)
            {
                await _logService.RegistrarAsync("Edição", "Fornecedores", $"Atualizou dados do fornecedor '{fornecedor.Nome}'");
            }

            return result;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            var result = await _repository.DeleteAsync(id);

            if (result)
            {
                await _logService.RegistrarAsync("Exclusão", "Fornecedores", $"Excluiu/Inativou o fornecedor '{existing.Nome}'");
            }

            return result;
        }
    }
}