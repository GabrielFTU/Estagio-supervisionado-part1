using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Valisys_Production.Models
{
    public class SolicitacaoProducaoItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid SolicitacaoProducaoId { get; set; }
        public SolicitacaoProducao SolicitacaoProducao { get; set; }

        public Guid ProdutoId { get; set; }
        public Produto Produto { get; set; }

        public int Quantidade { get; set; }
    }
}