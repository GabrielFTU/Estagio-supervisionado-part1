using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public class FichaTecnica
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProdutoId { get; set; }
        public Produto Produto { get; set; }

        [Required]
        [MaxLength(50)]
        public string CodigoFicha { get; set; } 

        [MaxLength(100)]
        public string Versao { get; set; } = "1.0";

        [MaxLength(500)]
        public string Descricao { get; set; }

        public bool Ativa { get; set; } = true;
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public ICollection<FichaTecnicaItem> Itens { get; set; }
    }
}