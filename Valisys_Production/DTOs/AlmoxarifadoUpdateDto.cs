using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class AlmoxarifadoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome do almoxarifado é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [StringLength(255)]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "A localização é obrigatória.")]
        [StringLength(200)]
        public string Localizacao { get; set; }

        [Required(ErrorMessage = "O responsável é obrigatório.")]
        [StringLength(100)]
        public string Responsavel { get; set; }

        [StringLength(20)]
        public string? Contato { get; set; } 

        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
        [StringLength(100)]
        public string? Email { get; set; } 

        public bool Ativo { get; set; }
    }
}