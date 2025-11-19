using System;

namespace Valisys_Production.DTOs
{
    public class FornecedorReadDto
    {
        public Guid Id { get; set; }

        
        public string NomeFantasia { get; set; }
        public string RazaoSocial { get; set; } 
        public string Cnpj { get; set; } = string.Empty;
        public string Nome { get; set; }
        public string Documento { get; set; } 
        public int TipoDocumento { get; set; }
        public string Endereco { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string Observacoes { get; set; }
        public bool Ativo { get; set; }
    }
}