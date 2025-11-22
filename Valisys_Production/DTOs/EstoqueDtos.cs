using System;

namespace Valisys_Production.DTOs
{
    public class EstoqueSimplesDto
    {
        public Guid ProdutoId { get; set; }
        public string ProdutoNome { get; set; }
        public string CodigoProduto { get; set; }
        public string UnidadeMedida { get; set; }
        public int QuantidadeTotal { get; set; }
    }

    public class EstoqueAnaliticoDto
    {
        public Guid LoteId { get; set; }
        public string Chassi { get; set; } 
        public Guid ProdutoId { get; set; }
        public string ProdutoNome { get; set; }
        public string Localizacao { get; set; } 
        public DateTime DataConclusao { get; set; }
        public string Status { get; set; }
    }
}