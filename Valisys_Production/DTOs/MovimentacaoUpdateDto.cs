using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class MovimentacaoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O ID do Produto é obrigatório.")]
        public Guid ProdutoId { get; set; }

        [Required(ErrorMessage = "A quantidade é obrigatória.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "A quantidade deve ser positiva.")]
        public decimal Quantidade { get; set; }

        public Guid? OrdemDeProducaoId { get; set; }

        [Required(ErrorMessage = "O ID do Almoxarifado de Origem é obrigatório.")]
        public Guid AlmoxarifadoOrigemId { get; set; }

        [Required(ErrorMessage = "O ID do Almoxarifado de Destino é obrigatório.")]
        public Guid AlmoxarifadoDestinoId { get; set; }

        public string Observacoes { get; set; }
    }
}