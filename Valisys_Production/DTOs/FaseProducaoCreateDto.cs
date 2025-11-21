using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class FaseProducaoCreateDto
    {
        [Required(ErrorMessage = "O nome da fase é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        public string? Descricao { get; set; }

        [Required(ErrorMessage = "A ordem da fase é obrigatória.")]
        [Range(1, 100, ErrorMessage = "Ordem inválida!")]
        public int Ordem { get; set; }

        [Range(0, 365, ErrorMessage = "O tempo em dias deve ser entre 0 e 365.")]
        public int TempoPadraoDias { get; set; }

        public bool Ativo { get; set; } = true;
    }
}