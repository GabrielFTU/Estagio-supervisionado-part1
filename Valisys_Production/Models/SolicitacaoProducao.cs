using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;  

namespace Valisys_Production.Models
{
    public enum StatusSolicitacaoProducao
    {
        Pendente = 0,
        EmProducao = 1,
        Concluida = 2,
        Cancelada = 3,
        Aprovada = 4
    }

    public class SolicitacaoProducao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string CodigoSolicitacao { get; set; } = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

        public StatusSolicitacaoProducao Status { get; set; } = StatusSolicitacaoProducao.Pendente;
        public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow;
        public DateTime? DataAprovacao { get; set; }

        [MaxLength(500)]
        public string Observacoes { get; set; }

        public Guid EncarregadoId { get; set; }
        public Usuario Encarregado { get; set; }

        public Guid UsuarioAprovacaoId { get; set; }
        public Usuario UsuarioAprovacao { get; set; }

        public Guid ProdutoId { get; set; }
        public Produto Produto { get; set; }

        public int Quantidade { get; set; }

        public Guid TipoOrdemDeProducaoId { get; set; }
        public TipoOrdemDeProducao TipoOrdemDeProducao { get; set; }

        public OrdemDeProducao OrdemDeProducao { get; set; }
        public ICollection<SolicitacaoProducaoItem> Itens { get; set; }
    }
}
