using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;  

namespace Valisys_Production.Models
{
    public enum StatusSolicitacaoProducao
    {
        Pendente,
        EmProducao,
        Concluida,
        Cancelada
    }
    public class SolicitacaoProducao
    {
        [Key] 
        public int Id { get; set; } 

        public StatusSolicitacaoProducao Status { get; set; } = StatusSolicitacaoProducao.Pendente;
        public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow;

        [MaxLength(500)]   
        public string Observacoes { get; set; }
        public int EncarregadoId { get; set; }  
        public int ProdutoId { get; set; }  
        public int? OrdemDeProducaoId { get; set; }
        public Usuario Encarregado { get; set; }
        public Produto Produto { get; set; }    
        public OrdemDeProducao OrdemDeProducao { get; set; }


    }
}
