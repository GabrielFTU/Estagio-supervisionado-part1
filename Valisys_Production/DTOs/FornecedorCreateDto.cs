using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class FornecedorCreateDto
    {
        [Required]
        [MaxLength(255)]
        public string Nome { get;  set; }

        [Required]
        [MaxLength(20)]
        public string Documento { get; set; }

        [Required]
        public int TipoDocumento { get; set; }

        [MaxLength(255)]
        public string Endereco { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(15)]
        public string Telefone { get; set; }

        public bool Ativo { get; set; } = true;

        [MaxLength(500)]
        public string Observacoes { get; set; }
    }
}


