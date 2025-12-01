using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class AlmoxarifadoCreateDto
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(150)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [MaxLength(255)]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "A localização é obrigatória.")]
        [MaxLength(100)]
        public string Localizacao { get; set; } 

        [Required(ErrorMessage = "O responsável é obrigatório.")]
        [MaxLength(100)]
        public string Responsavel { get; set; }

        [MaxLength(20)]
        public string? Contato { get; set; } 
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        [MaxLength(100)]
        public string? Email { get; set; } 

        public bool Ativo { get; set; } = true; 
    }
}