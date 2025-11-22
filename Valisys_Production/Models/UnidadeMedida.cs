using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public enum GrandezaUnidade
    {
        Unidade = 0,    
        Massa = 1,      
        Comprimento = 2,
        Volume = 3,     
        Tempo = 4,      
        Area = 5        
    }

    public class UnidadeMedida
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Nome { get; set; } 

        [Required]
        [MaxLength(10)]
        public string Sigla { get; set; } 
        public GrandezaUnidade Grandeza { get; set; }
        public decimal FatorConversao { get; set; } = 1;
        public bool EhUnidadeBase { get; set; } = false;
        public ICollection<Produto> Produtos { get; set; }
    }
}