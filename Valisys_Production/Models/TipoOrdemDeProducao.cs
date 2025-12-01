using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public class TipoOrdemDeProducao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        [MaxLength(10)]
        public string Codigo { get; set; } 

        [MaxLength(500)]
        public string? Descricao { get; set; }

        public bool Ativo { get; set; } = true;

        public ICollection<OrdemDeProducao> OrdensDeProducao { get; set; }
    }
}