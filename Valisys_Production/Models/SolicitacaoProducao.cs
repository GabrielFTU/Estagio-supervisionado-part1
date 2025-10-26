using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;  

namespace Valisys_Production.Models
{
    public enum StatusSolicitacaoProducao
    {
        Pendente,
        EmProducao,
        Concluida,
        Cancelada,
        Aprovada
    }
    public class SolicitacaoProducao
    {
        //Properties
        [Key]
        public Guid Id { get; set; } = Guid.Empty;

        public string CodigoSolicitacao { get; set; } = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

        public StatusSolicitacaoProducao Status { get; set; } = StatusSolicitacaoProducao.Pendente;
        public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow;
        public DateTime DataAprovacao { get; set; }
        public int UsuarioAprovacaoId { get; set; }
        public Usuario UsuarioAprovacao { get; set; }


        [MaxLength(500)]   
        public string Observacoes { get; set; }

        //Foreign Keys 
        public int EncarregadoId { get; set; }  
        public int ProdutoId { get; set; }  
        public int Quantidade { get; set; }
        public int? OrdemDeProducaoId { get; set; }
        public int TipoOrdemDeProducaoId { get; set; }


        //Navigation Properties
        public Usuario Encarregado { get; set; }
        public Produto Produto { get; set; }
        public OrdemDeProducao OrdemDeProducao { get; set; }
        public TipoOrdemDeProducao TipoOrdemDeProducao { get; set; }
        public ICollection<SolicitacaoProducaoItem> Itens { get; set; }
    }
}
