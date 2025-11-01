using System;

namespace Valisys_Production.DTOs
{
    public class PerfilReadDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public bool Ativo { get; set; }
    }
}