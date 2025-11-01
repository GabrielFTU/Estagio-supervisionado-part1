using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class SolicitacaoProducaoCreateDto
    {
        [Required(ErrorMessage = "O código é obrigatório.")]
        [StringLength(50)]
        public string Codigo { get; set; }

        [Required(ErrorMessage = "A quantidade é obrigatória.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "A quantidade deve ser positiva.")]
        public decimal QuantidadeSolicitada { get; set; }

        [Required(ErrorMessage = "O ID do Produto é obrigatório.")]
        public Guid ProdutoId { get; set; }
    }
}