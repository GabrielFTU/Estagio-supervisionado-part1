using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class FaseProducaoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome da fase é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "A ordem da fase é obrigatória.")]
        [Range(1, 100)]
        public int Ordem { get; set; }

        public string? Descricao { get; set; }

        [Range(0, 365)]
        public int TempoPadraoDias { get; set; }

        public bool Ativo { get; set; }
    }
}