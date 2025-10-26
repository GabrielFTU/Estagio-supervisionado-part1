using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Valisys_Production.Models
{
    public class SolicitacaoProducaoItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.Empty;

        [ForeignKey("SolicitacaoProducao")]
        public int SolicitacaoProducaoId { get; set; }
        public SolicitacaoProducao SolicitacaoProducao { get; set; }

        [ForeignKey("Produto")]
        public Guid ProdutoId { get; set; }
        public Produto Produto { get; set; }

        public int Quantidade { get; set; }
    }
}