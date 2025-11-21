using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public class RoteiroProducao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Codigo { get; set; } 

        [MaxLength(20)]
        public string Versao { get; set; } = "1.0";

        [MaxLength(500)]
        public string Descricao { get; set; }

        public Guid ProdutoId { get; set; }
        public Produto Produto { get; set; }

        public bool Ativo { get; set; } = true;

        public ICollection<RoteiroProducaoEtapa> Etapas { get; set; }
    }
}