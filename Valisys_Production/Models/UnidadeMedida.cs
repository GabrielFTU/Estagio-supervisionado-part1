using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Valisys_Production.Models
{
    public class UnidadeMedida
    {
        [Key]
        public Guid Id { get; set; } = Guid.Empty;

        [Required]
        [MaxLength(50)]
        public string Nome { get; set; }

        [Required]
        [MaxLength(10)]
        public string Sigla { get; set; }
        public ICollection<Produto> Produtos { get; set; }
    }
}
