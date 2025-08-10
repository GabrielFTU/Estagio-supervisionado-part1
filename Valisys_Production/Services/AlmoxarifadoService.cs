using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Valisys_Production.Services
{
    public class AlmoxarifadoService : IAlmoxarifadoService
    {
        private readonly IAlmoxarifadoRepository _repository; 

        public AlmoxarifadoService(IAlmoxarifadoRepository repository)
        {
            _repository = repository;
        }
        public async Task<Almoxarifado> CreateAsync(Almoxarifado almoxarifado) 
        {
            if (string.IsNullOrEmpty(almoxarifado.Nome)) 
            {
                throw new ArgumentException("O nome do almoxarifado não pode ser vazio.");
            }
            almoxarifado.DataCadastro = DateTime.Now;
            return await _repository.AddAsync(almoxarifado);
        }
        public async Task<Almoxarifado> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Almoxarifado>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task UpdateAsync(Almoxarifado almoxarifado)
        {
            if (string.IsNullOrEmpty(almoxarifado.Nome))
            {
                throw new ArgumentException("O nome do almoxarifado não pode ser vazio.");
            }
            await _repository.UpdateAsync(almoxarifado);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
