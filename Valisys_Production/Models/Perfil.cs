using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public class Perfil
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Nome { get; set; }

        public bool Ativo { get; set; } = true;
        public List<string> Acessos { get; set; } = new List<string>(); 

        public ICollection<Usuario> Usuarios { get; set; }
    }
}