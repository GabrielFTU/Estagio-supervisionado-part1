using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models
{
    public class Produto
    {
        [Key]
        public Guid Id { get; set; } = Guid.Empty;

        [Required]
        [MaxLength(255)]
        public string Nome { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        [Required]
        [MaxLength(50)]
        public string CodigoInternoProduto { get; set; }

        public bool ControlarPorLote { get; set; } = false;
        [MaxLength(500)]
        public string Observacoes { get; set; }

        public bool Ativo { get; set; } = true;
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

        public int UnidadeMedidaId { get; set; }
        public int CategoriaProdutoId { get; set; }

        public UnidadeMedida UnidadeMedida { get; set; }
        public CategoriaProduto CategoriaProduto { get; set; }  
    }
}
