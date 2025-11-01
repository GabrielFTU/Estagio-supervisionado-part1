using System;

namespace Valisys_Production.DTOs
{
    public class ProdutoReadDto
    {
        public Guid Id { get; set; }
        public string Codigo { get; set; }
        public string Nome { get; set; }
        public decimal EstoqueMinimo { get; set; }
        public bool ControlarPorLote { get; set; }
        public bool Ativo { get; set; }
        public Guid CategoriaProdutoId { get; set; }
        public string CategoriaProdutoNome { get; set; }
        public Guid UnidadeMedidaId { get; set; }
        public string UnidadeMedidaSigla { get; set; }
        public Guid? AlmoxarifadoEstoqueId { get; set; }
        public string AlmoxarifadoEstoqueNome { get; set; }
    }
}