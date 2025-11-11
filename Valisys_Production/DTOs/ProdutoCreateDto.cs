using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class ProdutoCreateDto
    {
        [Required]
        [MaxLength(150)]
        public string Nome { get; set; }

        [Required]
        [MaxLength(255)]
        public string Descricao { get; set; }

        [Required]
        [MaxLength(50)]
        public string CodigoInternoProduto { get; set; }

        public bool ControlarPorLote { get; set; }

        [MaxLength(500)]
        public string Observacoes { get; set; }

        [Required]
        public Guid UnidadeMedidaId { get; set; }

        [Required]
        public Guid CategoriaProdutoId { get; set; }
    }
}
