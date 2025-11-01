using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class FaseProducaoCreateDto
    {
        [Required(ErrorMessage = "O nome da fase é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "A ordem da fase é obrigatória.")]
        [Range(1, 100, ErrorMessage = "Ordem invalida!")]
        public int Ordem { get; set; }

        public bool Ativo { get; set; } = true;
    }
}