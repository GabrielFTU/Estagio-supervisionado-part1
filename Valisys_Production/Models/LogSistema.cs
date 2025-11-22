using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models
{
    public class LogSistema
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        [Required]
        [MaxLength(50)]
        public string Acao { get; set; } 

        [Required]
        [MaxLength(50)]
        public string Modulo { get; set; } 

        [MaxLength(1000)]
        public string Detalhes { get; set; } 

        public DateTime DataHora { get; set; } = DateTime.UtcNow;
    }
}