using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class SolicitacaoProducaoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O código é obrigatório.")]
        [StringLength(50)]
        public string Codigo { get; set; }

        [Required(ErrorMessage = "A quantidade é obrigatória.")]
        [Range(0.01, double.MaxValue)]
        public decimal QuantidadeSolicitada { get; set; }

        //public StatusSolicitacaoProducao Status { get; set; }
        [Required]
        public Guid ProdutoId { get; set; }
    }
}