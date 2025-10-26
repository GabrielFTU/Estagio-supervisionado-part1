using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models 
{ 

    public enum StatusOrdemDeProducao
    {
        Ativa = 1,
        Aguardando = 2,
        Finalizada = 3,
        Cancelada = 4
    }
    public class OrdemDeProducao
    {
        //Properties
        [Key]
        public Guid Id { get; set; } = Guid.Empty;
        [Required]
        [MaxLength(50)]
        public string CodigoOrdem { get; set; }
        public int Quantidade { get; set; }
        public StatusOrdemDeProducao Status { get; set; } = StatusOrdemDeProducao.Ativa;

        public DateTime DataInicio { get; set; } = DateTime.UtcNow;
        public DateTime? DataFim { get; set; } = null;
        public int TipoOrdemDeProducaoId { get; set; }
        public int SolicitacaoProducaoId { get; set; }

        [MaxLength(500)]
        public string Observacoes { get; set; }

        //Foreign Keys
        public int ProdutoId { get; set; }
        public int AlmoxarifadoId { get; set; }
        public int FaseAtualId { get; set; }
        public int? LoteId { get; set; }
        
        //Navigation Properties
        public Produto Produto { get; set; }
        public Almoxarifado Almoxarifado { get; set; }
        public FaseProducao FaseAtual { get; set; }
        public Lote Lote { get; set; }
        public TipoOrdemDeProducao TipoOrdemDeProducao { get; set; }
        public SolicitacaoProducao SolicitacaoProducao { get; set; }
    }
}
