using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models
{
    public class Produto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Nome { get; set; }

        [MaxLength(500)]
        public string Descricao { get; set; }

        [MaxLength(50)]
        public string Codigo_Barras { get; set; }

        [Required]
        [MaxLength(50)]
        public int codigo_interno_Produto { get; set; }

        [Required]
        [MaxLength(50)]
        public string Unidade_Medida { get; set; }  

        [Required]
        public string Categoria { get; set; }

        [MaxLength(500)]
        public string Observacoes { get; set; }
        public bool Ativo { get; set; } = true;
        public DateTime DataCadastro { get; set; } = DateTime.Now;
        
    }
}
