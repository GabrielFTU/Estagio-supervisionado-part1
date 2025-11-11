using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class PerfilUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome do perfil é obrigatório.")]
        [StringLength(50)]
        public string Nome { get; set; }

        public bool Ativo { get; set; } = true;
    }
}