using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class CategoriaProdutoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome da categoria é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O código da categoria é obrigatório.")]
        [StringLength(10)]
        public string Codigo { get; set; }

        public bool Ativo { get; set; }
    }
}