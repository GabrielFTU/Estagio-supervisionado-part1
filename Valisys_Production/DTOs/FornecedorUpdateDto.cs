using System;
using System.ComponentModel.DataAnnotations;
using Valisys_Production.Models;

namespace Valisys_Production.DTOs
{
    public class FornecedorUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(255)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O documento é obrigatório.")]
        [MaxLength(20)]
        public string Documento { get; set; }

        [Required]
        public TipoDocumento TipoDocumento { get; set; }

        [MaxLength(255)]
        public string Endereco { get; set; }

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        [MaxLength(20)]
        public string Telefone { get; set; }

        public bool Ativo { get; set; }

        [MaxLength(500)]
        public string? Observacoes { get; set; }
    }
}