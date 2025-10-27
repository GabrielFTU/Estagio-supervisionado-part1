using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class MovimentacaoCreateDto
    {
        [Required]
        public Guid ProdutoId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "A quantidade deve ser positiva.")]
        public decimal Quantidade { get; set; }

        public Guid? OrdemDeProducaoId { get; set; } 

        [Required]
        public Guid AlmoxarifadoOrigemId { get; set; }

        [Required]
        public Guid AlmoxarifadoDestinoId { get; set; }

      
    }
}