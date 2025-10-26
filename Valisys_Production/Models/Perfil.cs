using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public class Perfil
    {
        [Key]
        public Guid Id { get; set; } = Guid.Empty;

        [Required]
        [MaxLength(50)]
        public string Nome { get; set; }

        public ICollection<Usuario> Usuarios { get; set; } 
    }
}
