using Valisys_Production.Models;

namespace Valisys_Production.DTOs
{
    public class UsuarioReadDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public bool Ativo { get; set; }
        public Guid PerfilId { get; set; }
        public Perfil Perfil { get; set; }
    }
}