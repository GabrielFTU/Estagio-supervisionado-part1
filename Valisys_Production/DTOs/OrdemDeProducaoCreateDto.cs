using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class OrdemDeProducaoCreateDto
    {
        [Required(ErrorMessage = "A quantidade é obrigatória.")]
        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public int Quantidade { get; set; }
        [MaxLength(500)]
        public string? Observacoes { get; set; }
        [Required(ErrorMessage = "O produto é obrigatório.")]
        public Guid ProdutoId { get; set; }
        [Required(ErrorMessage = "O almoxarifado é obrigatório.")]
        public Guid AlmoxarifadoId { get; set; }
        public Guid? FaseAtualId { get; set; }
        [Required(ErrorMessage = "O tipo de ordem é obrigatório.")]
        public Guid TipoOrdemDeProducaoId { get; set; }
        public Guid? LoteId { get; set; }
    }
}