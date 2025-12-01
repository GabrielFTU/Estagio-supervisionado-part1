using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class TipoOrdemDeProducaoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome do tipo de ordem é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O código é obrigatório.")]
        [StringLength(10)]
        public string Codigo { get; set; }

        [StringLength(500)]
        public string? Descricao { get; set; } 

        public bool Ativo { get; set; }
    }
}