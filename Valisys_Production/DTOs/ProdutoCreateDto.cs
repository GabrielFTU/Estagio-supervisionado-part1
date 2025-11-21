using System.ComponentModel.DataAnnotations;
using Valisys_Production.Models.Enums;

namespace Valisys_Production.DTOs
{
    public class ProdutoCreateDto
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(150)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(255)]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "A classificação é obrigatória.")]
        public ClassificacaoProduto Classificacao { get; set; }

        public bool ControlarPorLote { get; set; }

        [MaxLength(500)]
        public string Observacoes { get; set; }

        [Required]
        public Guid UnidadeMedidaId { get; set; }

        [Required]
        public Guid CategoriaProdutoId { get; set; }
    }
}
