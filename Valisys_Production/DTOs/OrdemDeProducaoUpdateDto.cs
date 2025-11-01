using System;
using System.ComponentModel.DataAnnotations;
using Valisys_Production.Models;

namespace Valisys_Production.DTOs
{
    public class OrdemDeProducaoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O código da ordem é obrigatório.")]
        [StringLength(50)]
        public string CodigoOrdem { get; set; }

        [Required(ErrorMessage = "A quantidade é obrigatória.")]
        [Range(1, int.MaxValue)]
        public int Quantidade { get; set; }

        public StatusOrdemDeProducao Status { get; set; }

        [StringLength(500)]
        public string? Observacoes { get; set; }

        [Required]
        public Guid ProdutoId { get; set; }

        [Required]
        public Guid AlmoxarifadoId { get; set; }

        [Required]
        public Guid FaseAtualId { get; set; }

        public Guid? LoteId { get; set; }

        public Guid TipoOrdemDeProducaoId { get; set; }
    }
}