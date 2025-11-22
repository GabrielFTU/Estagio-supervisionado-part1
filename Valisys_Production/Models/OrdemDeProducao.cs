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
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string CodigoOrdem { get; set; }

        public int Quantidade { get; set; }
        public StatusOrdemDeProducao Status { get; set; } = StatusOrdemDeProducao.Ativa;
        public DateTime DataInicio { get; set; } = DateTime.UtcNow;
        public DateTime? DataFim { get; set; }

        [MaxLength(500)]
        public string Observacoes { get; set; } = string.Empty; 

        public Guid ProdutoId { get; set; }
        public Produto Produto { get; set; }

        public Guid AlmoxarifadoId { get; set; }
        public Almoxarifado Almoxarifado { get; set; }

        public Guid FaseAtualId { get; set; }
        public FaseProducao FaseAtual { get; set; }

        public Guid? LoteId { get; set; }
        public Lote Lote { get; set; }

        public Guid? RoteiroProducaoId { get; set; }
        public RoteiroProducao RoteiroProducao { get; set; }

        public Guid TipoOrdemDeProducaoId { get; set; }
        public TipoOrdemDeProducao TipoOrdemDeProducao { get; set; }

        public Guid? SolicitacaoProducaoId { get; set; }
        public SolicitacaoProducao SolicitacaoProducao { get; set; }
    }
}