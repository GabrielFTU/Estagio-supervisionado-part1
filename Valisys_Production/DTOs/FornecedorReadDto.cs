using System;

namespace Valisys_Production.DTOs
{
    public class FornecedorReadDto
    {
        public Guid Id { get; set; }
        public string NomeFantasia { get; set; }
        public string RazaoSocial { get; set; }
        public string Cnpj { get; set; }
        public string Email { get; set; }
        public bool Ativo { get; set; }
    }
}