using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models
{
    public class Almoxarifado
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(255)]
        public string Nome { get; set; }

        [Required]
        public string Descricao{ get; set; }

        [Required]
        [MaxLength(100)]
        public string Localizacao { get; set; }

        [Required]
        [MaxLength(15)]
        public string Responsavel { get; set; }

        [MaxLength(15)]
        public string Contato { get; set; }
        [MaxLength(100)]
        public string email { get; set; }   

        public bool Ativo { get; set; } = true;
        public DateTime DataCadastro { get; set; } = DateTime.Now;  

    }
}
