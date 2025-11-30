using Valisys_Production.DTOs;
using Valisys_Production.Models;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Valisys_Production.Services
{
    public class RoteiroProducaoService : IRoteiroProducaoService
    {
        private readonly IRoteiroProducaoRepository _repository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IFaseProducaoRepository _faseRepository;
        private readonly ILogSistemaService _logService;

        public RoteiroProducaoService(
            IRoteiroProducaoRepository repository,
            IProdutoRepository produtoRepository,
            IFaseProducaoRepository faseRepository,
            ILogSistemaService logService)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
            _faseRepository = faseRepository;
            _logService = logService;
        }

        public async Task<RoteiroProducao> CreateAsync(RoteiroProducaoCreateDto dto)
        {
            var produto = await _produtoRepository.GetByIdAsync(dto.ProdutoId);
            if (produto == null) throw new KeyNotFoundException("Produto não encontrado.");

            var codigo = dto.Codigo;
            if (string.IsNullOrEmpty(codigo) || codigo.StartsWith("RASCUNHO-"))
            {
                  codigo = $"RT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";
            }

            var roteiro = new RoteiroProducao
            {
                ProdutoId = dto.ProdutoId,
                Codigo = codigo, 
                Versao = dto.Versao,
                Descricao = dto.Descricao,
                Ativo = true,
                Etapas = new List<RoteiroProducaoEtapa>()
            };

            if (dto.Etapas != null)
            {
                foreach (var etapaDto in dto.Etapas)
                {
                    var fase = await _faseRepository.GetByIdAsync(etapaDto.FaseProducaoId);
                    if (fase == null) throw new KeyNotFoundException($"Fase {etapaDto.FaseProducaoId} não encontrada.");

                    roteiro.Etapas.Add(new RoteiroProducaoEtapa
                    {
                        FaseProducaoId = etapaDto.FaseProducaoId,
                        Ordem = etapaDto.Ordem,
                        TempoDias = etapaDto.TempoDias,
                        Instrucoes = etapaDto.Instrucoes
                    });
                }
            }

            var created = await _repository.AddAsync(roteiro);

            await _logService.RegistrarAsync(
                "Criação", 
                "Engenharia", 
                $"Criou Roteiro de Produção {created.Codigo} para '{produto.Nome}'"
            );

            return created;
        }

        public async Task<bool> UpdateAsync(RoteiroProducaoUpdateDto dto)
        {
            if (dto.Id == Guid.Empty) throw new ArgumentException("ID inválido.");
            
            var existingRoteiro = await _repository.GetByIdAsync(dto.Id);
            if (existingRoteiro == null) throw new KeyNotFoundException("Roteiro não encontrado.");

            var novasEtapas = new List<RoteiroProducaoEtapa>();
            if (dto.Etapas != null)
            {
                foreach (var etapaDto in dto.Etapas)
                {
                    var fase = await _faseRepository.GetByIdAsync(etapaDto.FaseProducaoId);
                    if (fase == null) throw new KeyNotFoundException($"Fase {etapaDto.FaseProducaoId} não encontrada.");

                    novasEtapas.Add(new RoteiroProducaoEtapa
                    {
                        FaseProducaoId = etapaDto.FaseProducaoId,
                        Ordem = etapaDto.Ordem,
                        TempoDias = etapaDto.TempoDias,
                        Instrucoes = etapaDto.Instrucoes
                    });
                }
            }

            var roteiroAtualizado = new RoteiroProducao
            {
                Id = dto.Id,
                Codigo = dto.Codigo,
                Versao = dto.Versao,
                Descricao = dto.Descricao,
                Ativo = dto.Ativo,
                ProdutoId = existingRoteiro.ProdutoId 
            };

            var updated = await _repository.UpdateWithEtapasAsync(roteiroAtualizado, novasEtapas);

            if (updated)
            {
                await _logService.RegistrarAsync(
                    "Edição", 
                    "Engenharia", 
                    $"Atualizou Roteiro de Produção {roteiroAtualizado.Codigo}"
                );
            }

            return updated;
        }

        public async Task<RoteiroProducao?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);
        public async Task<IEnumerable<RoteiroProducao>> GetAllAsync() => await _repository.GetAllAsync();
        
        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                await _logService.RegistrarAsync(
                    "Exclusão", 
                    "Engenharia", 
                    $"Inativou Roteiro de Produção {existing.Codigo}"
                );
            }

            return deleted;
        }
    }
}