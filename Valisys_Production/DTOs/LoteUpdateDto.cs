using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class LoteUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O número do lote é obrigatório.")]
        [StringLength(50)]
        public string NumeroLote { get; set; }

        [Required(ErrorMessage = "A data de fabricação é obrigatória.")]
        public DateTime DataFabricacao { get; set; }

        public DateTime? DataVencimento { get; set; }

        [Required]
        public Guid ProdutoId { get; set; }

        public bool Ativo { get; set; }
    }
}