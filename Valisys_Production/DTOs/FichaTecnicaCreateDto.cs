using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class FichaTecnicaItemDto
    {
        [Required]
        public Guid ProdutoComponenteId { get; set; }

        [Required]
        [Range(0.0001, double.MaxValue, ErrorMessage = "Quantidade deve ser maior que zero")]
        public decimal Quantidade { get; set; }

        public decimal PerdaPercentual { get; set; }
    }

    public class FichaTecnicaCreateDto
    {
        [Required]
        public Guid ProdutoId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Codigo { get; set; }

        [MaxLength(100)]
        public string Versao { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        public List<FichaTecnicaItemDto> Itens { get; set; }
    }
}