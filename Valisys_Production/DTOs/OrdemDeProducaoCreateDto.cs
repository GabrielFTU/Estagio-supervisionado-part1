using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class OrdemDeProducaoCreateDto
    {
        [Required]
        [MaxLength(50)]
        public string CodigoOrdem { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public int Quantidade { get; set; }

        [MaxLength(500)]
        public string? Observacoes { get; set; }

        [Required]
        public Guid ProdutoId { get; set; }

        [Required]
        public Guid AlmoxarifadoId { get; set; }

        [Required]
        public Guid FaseAtualId { get; set; }

        [Required]
        public Guid TipoOrdemDeProducaoId { get; set; }

        public Guid? LoteId { get; set; }
    }
}