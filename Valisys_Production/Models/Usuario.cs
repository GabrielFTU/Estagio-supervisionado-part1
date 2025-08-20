using System.ComponentModel.DataAnnotations;
using System;

namespace Valisys_Production.Models
{
    public class Usuario
    {
        [Key] 
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        public string SenhaHash { get; set; }
        public bool Ativo { get; set; } = true;

        public int PerfilId { get; set; }
        public Perfil Perfil { get; set; }

    }
}
