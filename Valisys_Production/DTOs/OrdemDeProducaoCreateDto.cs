using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class OrdemDeProducaoCreateDto
    {
        [Required]
        [MaxLength(50)]
        public string CodigoOrdem { get; set; }
        public int Quantidade { get; set; }
        public string Observacoes { get; set; }
        public int ProdutoId { get; set; }
        public int AlmoxarifadoId { get; set; }
        public int FaseAtualId { get; set; }
        public int TipoOrdemDeProducaoId { get; set; }

        public int? LoteId { get; set; }
    }
}
