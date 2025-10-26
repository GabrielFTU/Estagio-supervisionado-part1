using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class LoteCreateDto
    {
        [Required]
        [MaxLength(50)]
        public string CodigoLote { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        [MaxLength(500)]
        public string Observacoes { get; set; }

        [Required]
        public int ProdutoId { get; set; }

        [Required]
        public int AlmoxarifadoId { get; set; }
    }
}
