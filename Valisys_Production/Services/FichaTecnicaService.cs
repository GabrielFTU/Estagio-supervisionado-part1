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

        public FichaTecnicaService(IFichaTecnicaRepository repository, IProdutoRepository produtoRepository)
        {
            _repository = repository;
            _produtoRepository = produtoRepository;
        }

        public async Task<FichaTecnica> CreateAsync(FichaTecnica ficha)
        {
            var produtoPai = await _produtoRepository.GetByIdAsync(ficha.ProdutoId);
            if (produtoPai == null)
                throw new KeyNotFoundException("Produto pai não encontrado.");

            if (produtoPai.Classificacao == ClassificacaoProduto.MateriaPrima ||
                produtoPai.Classificacao == ClassificacaoProduto.MaterialConsumo)
            {
                throw new InvalidOperationException($"Não é possível criar ficha técnica para um produto classificado como {produtoPai.Classificacao}.");
            }

            if (ficha.Itens != null)
            {
                foreach (var item in ficha.Itens)
                {
                    var componente = await _produtoRepository.GetByIdAsync(item.ProdutoComponenteId);
                    if (componente == null)
                        throw new KeyNotFoundException($"Componente {item.ProdutoComponenteId} não encontrado.");

                    if (item.ProdutoComponenteId == ficha.ProdutoId)
                        throw new InvalidOperationException("Um produto não pode ser componente dele mesmo (referência circular).");
                }
            }

            return await _repository.AddAsync(ficha);
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
                    if (itemDto.ProdutoComponenteId == fichaOriginal.ProdutoId)
                    {
                        throw new InvalidOperationException("Referência circular detectada: O produto pai não pode ser um componente.");
                    }

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
                Ativa = dto.Ativa
            };

            return await _repository.UpdateWithItemsAsync(fichaParaAtualizar, novosItens);
        }

        public async Task<bool> DeleteAsync(Guid id) => await _repository.DeleteAsync(id);
    }
}