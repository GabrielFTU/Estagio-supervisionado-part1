using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models 
{ 

    public enum StatusOrdemDeProducao
    {
        Ativa = 1,
        Aguardando = 2,
        Finalizanda = 3
    }
    public class OrdemDeProducao
    {
    
            [Key]
            public int Id { get; set; }

            [Required]
            [MaxLength(50)]
            public string CodigoOrdem { get; set; }

            public int Quantidade { get; set; }
            public StatusOrdemDeProducao Status { get; set; } = StatusOrdemDeProducao.Ativa;

            public DateTime DataInicio { get; set; } = DateTime.UtcNow;
            public DateTime? DataFim { get; set; } = null;
            public int TipoOrdemDeProducaoId { get; set; }      
       
            [MaxLength(500)]
            public string Observacoes { get; set; }

            public int ProdutoId { get; set; }
            public int AlmoxarifadoId { get; set; }
            public int FaseAtualId { get; set; }
            public int? LoteId { get; set; }
            

            public Produto Produto { get; set; }
            public Almoxarifado Almoxarifado { get; set; }
            public FaseProducao FaseAtual { get; set; }
            public Lote Lote { get; set; }
            public TipoOrdemDeProducao TipoOrdemDeProducao { get; set; }
    }
}
