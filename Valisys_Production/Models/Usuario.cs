using System.ComponentModel.DataAnnotations;
using System;

namespace Valisys_Production.Models
{
    public class Usuario
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string SenhaHash { get; set; }

        public bool Ativo { get; set; } = true;

        public Guid PerfilId { get; set; }
        public Perfil Perfil { get; set; }
        public DateTime DataCadastro { get; set; }
    }
}
