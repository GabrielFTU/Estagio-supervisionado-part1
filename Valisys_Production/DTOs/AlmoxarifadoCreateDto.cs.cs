using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class AlmoxarifadoCreateDto
    {
        [Required]
        [MaxLength(150)]
        public string Nome { get; set; }

        [MaxLength(255)]
        public string Descricao { get; set; }

        [Required]
        [MaxLength(100)]
        public string Localizacao { get; set; } 

        [Required]
        [MaxLength(100)]
        public string Responsavel { get; set; }

        [MaxLength(20)]
        public string Contato { get; set; }

        [MaxLength(100)]
        public string Email { get; set; } 
    }
}
