using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class FornecedorUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome fantasia é obrigatório.")]
        [StringLength(100)]
        public string NomeFantasia { get; set; }

        [Required(ErrorMessage = "A razão social é obrigatória.")]
        [StringLength(150)]
        public string RazaoSocial { get; set; }

        [Required(ErrorMessage = "O CNPJ é obrigatório.")]
        [StringLength(18)]
        // Nota: Idealmente, validação de CNPJ seria implementada, mas mantemos o básico por agora.
        public string Cnpj { get; set; }

        [EmailAddress(ErrorMessage = "O e-mail não é válido.")]
        public string Email { get; set; }

        public bool Ativo { get; set; }
    }
}