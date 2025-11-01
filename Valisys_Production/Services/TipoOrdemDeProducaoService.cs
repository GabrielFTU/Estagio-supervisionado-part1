using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;


namespace Valisys_Production.Services
{
    public class TipoOrdemDeProducaoService : ITipoOrdemDeProducaoService
    {
        private readonly ITipoOrdemDeProducaoRepository _repository;

        public TipoOrdemDeProducaoService(ITipoOrdemDeProducaoRepository repository)
        {
            _repository = repository;
        }

        public async Task<TipoOrdemDeProducao> CreateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            if (string.IsNullOrEmpty(tipoOrdemDeProducao.Nome))
            {
                throw new ArgumentException("O nome do tipo de ordem de produção é obrigatório.");
            }
            return await _repository.AddAsync(tipoOrdemDeProducao);
        }

        public async Task<TipoOrdemDeProducao?> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Tipo de Ordem de Produção inválido.");
            }
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<TipoOrdemDeProducao>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<bool> UpdateAsync(TipoOrdemDeProducao tipoOrdemDeProducao)
        {
            if (tipoOrdemDeProducao.Id == Guid.Empty)
            {
                throw new ArgumentException("ID do Tipo de Ordem de Produção ausente para atualização.");
            }
            if (string.IsNullOrEmpty(tipoOrdemDeProducao.Nome))
            {
                throw new ArgumentException("O nome do tipo de ordem de produção é obrigatório.");
            }

            var existingTipo = await _repository.GetByIdAsync(tipoOrdemDeProducao.Id);
            if (existingTipo == null)
            {
                throw new KeyNotFoundException($"Tipo de Ordem de Produção com ID {tipoOrdemDeProducao.Id} não encontrado.");
            }

            return await _repository.UpdateAsync(tipoOrdemDeProducao);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID do Tipo de Ordem de Produção inválido para exclusão.");
            }

            var existingTipo = await _repository.GetByIdAsync(id);
            if (existingTipo == null)
            {
                return false;
            }

           
            return await _repository.DeleteAsync(id);
        }
    }
}