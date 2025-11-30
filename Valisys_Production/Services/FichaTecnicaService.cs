using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Valisys_Production.DTOs;
using Valisys_Production.Models;
using Valisys_Production.Models.Enums;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services.Interfaces;

namespace Valisys_Production.Services
{
    public class FichaTecnicaService : IFichaTecnicaService
    {
        private readonly IFichaTecnicaRepository _repository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly ILogSistemaService _logService;

        public FichaTecnicaService(
            IFichaTecnicaRepository repository, 
            IProdutoRepository produtoRepository,
            ILogSistemaService logService)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
            _logService = logService;
        }

        private async Task<string> GerarProximoCodigoAsync()
        {
            var ultimoCodigo = await _repository.GetUltimoCodigoAsync();
            int proximoNumero = 1;

            if (!string.IsNullOrEmpty(ultimoCodigo))
            {
                var partes = ultimoCodigo.Split('-');
                if (partes.Length > 1 && int.TryParse(partes[1], out int ultimoNumero))
                {
                    proximoNumero = ultimoNumero + 1;
                }
            }

            return $"FT-{proximoNumero:D4}"; 
        }

        public async Task<string> ObterProximoCodigoAsync()
        {
            return await GerarProximoCodigoAsync();
        }

        public async Task<FichaTecnica> CreateAsync(FichaTecnica ficha)
        {
            var produtoPai = await _produtoRepository.GetByIdAsync(ficha.ProdutoId);
            if (produtoPai == null)
                throw new KeyNotFoundException("Produto pai não encontrado.");

            if (produtoPai.Classificacao == ClassificacaoProduto.MateriaPrima ||
                produtoPai.Classificacao == ClassificacaoProduto.MaterialConsumo)
            {
                throw new InvalidOperationException($"Não é possível criar ficha técnica para produto classificado como {produtoPai.Classificacao}.");
            }

            if (string.IsNullOrEmpty(ficha.CodigoFicha))
            {
                ficha.CodigoFicha = await GerarProximoCodigoAsync();
            }

            if (ficha.Itens != null)
            {
                foreach (var item in ficha.Itens)
                {
                    var componente = await _produtoRepository.GetByIdAsync(item.ProdutoComponenteId);
                    if (componente == null)
                        throw new KeyNotFoundException($"Componente {item.ProdutoComponenteId} não encontrado.");

                    if (!componente.Ativo)
                        throw new InvalidOperationException($"Produto '{componente.Nome}' está INATIVO.");

                    if (item.ProdutoComponenteId == ficha.ProdutoId)
                        throw new InvalidOperationException("Referência circular detectada.");
                }
            }

            var created = await _repository.AddAsync(ficha);

            await _logService.RegistrarAsync(
                "Criação", 
                "Engenharia", 
                $"Criou Ficha Técnica {created.CodigoFicha} para o produto '{produtoPai.Nome}'"
            );

            return created;
        }

        public async Task<FichaTecnica?> GetByIdAsync(Guid id) => await _repository.GetByIdAsync(id);

        public async Task<IEnumerable<FichaTecnica>> GetAllAsync() => await _repository.GetAllAsync();

        public async Task<IEnumerable<FichaTecnica>> GetByProdutoIdAsync(Guid produtoId)
        {
            var todas = await _repository.GetAllAsync();
            return todas.Where(f => f.ProdutoId == produtoId);
        }

        public async Task<bool> UpdateAsync(FichaTecnicaUpdateDto dto)
        {
            if (dto.Id == Guid.Empty) throw new ArgumentException("ID inválido.");

            var fichaOriginal = await _repository.GetByIdAsync(dto.Id);
            if (fichaOriginal == null) throw new KeyNotFoundException("Ficha técnica não encontrada.");

            var novosItens = new List<FichaTecnicaItem>();

            if (dto.Itens != null)
            {
                foreach (var itemDto in dto.Itens)
                {
                    var componente = await _produtoRepository.GetByIdAsync(itemDto.ProdutoComponenteId);
                    if (componente == null)
                        throw new KeyNotFoundException($"Componente {itemDto.ProdutoComponenteId} não encontrado.");

                    if (!componente.Ativo)
                        throw new InvalidOperationException($"Produto '{componente.Nome}' está INATIVO.");

                    if (itemDto.ProdutoComponenteId == fichaOriginal.ProdutoId)
                        throw new InvalidOperationException("Referência circular detectada.");

                    novosItens.Add(new FichaTecnicaItem
                    {
                        ProdutoComponenteId = itemDto.ProdutoComponenteId,
                        Quantidade = itemDto.Quantidade,
                        PerdaPercentual = itemDto.PerdaPercentual
                    });
                }
            }

            var fichaParaAtualizar = new FichaTecnica
            {
                Id = dto.Id,
                CodigoFicha = dto.Codigo,
                Versao = dto.Versao,
                Descricao = dto.Descricao,
                Ativa = dto.Ativa,
                ProdutoId = fichaOriginal.ProdutoId
            };

            var updated = await _repository.UpdateWithItemsAsync(fichaParaAtualizar, novosItens);

            if (updated)
            {
                await _logService.RegistrarAsync(
                    "Edição", 
                    "Engenharia", 
                    $"Editou Ficha Técnica {fichaParaAtualizar.CodigoFicha}"
                );
            }

            return updated;
        }

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
                    $"Inativou/Excluiu Ficha Técnica {existing.CodigoFicha}"
                );
            }

            return deleted;
        }
    }
}