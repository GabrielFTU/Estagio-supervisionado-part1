using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class PerfilCreateDto
    {
        [Required(ErrorMessage = "O nome do perfil é obrigatório.")]
        [StringLength(50)]
        public string Nome { get; set; }
        public List<string> Acessos { get; set; } = new List<string>();
        public bool Ativo { get; set; } = true;
    }
}