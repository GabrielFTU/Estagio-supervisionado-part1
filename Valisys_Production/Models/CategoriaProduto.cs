using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public class CategoriaProduto
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        public ICollection<Produto> Produtos { get; set; }
    }
}
