using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Valisys_Production.Models
{
    public class SolicitacaoProducaoItem
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("SolicitacaoProducao")]
        public int SolicitacaoProducaoId { get; set; }
        public SolicitacaoProducao SolicitacaoProducao { get; set; }

        [ForeignKey("Produto")]
        public int ProdutoId { get; set; }
        public Produto Produto { get; set; }

        public int Quantidade { get; set; }
    }
}