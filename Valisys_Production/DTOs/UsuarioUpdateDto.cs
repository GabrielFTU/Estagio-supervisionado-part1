using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class UsuarioUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome do usuário é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O formato do e-mail é inválido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "O ID do perfil é obrigatório.")]
        public Guid PerfilId { get; set; }

        public bool Ativo { get; set; }
    }
}