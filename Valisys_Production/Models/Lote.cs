using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models
{
    public enum StatusLote
    {
        Pendente,
        EmProducao,
        Concluido,
        Cancelado
    }
    public class Lote
    {
        [Key]
        public int Id { get; set; }

        public bool Ativo { get; set; } = true;
        public DateTime DataCadastro { get; set; } = DateTime.Now;
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }   
        public StatusLote Status { get; set; } = StatusLote.Pendente;
        public int Quantidade { get; set; }
        public int ProdutoId { get; set; }
        public int AlmoxarifadoId { get; set; }
        public int FornecedorId { get; set; }
        [MaxLength(500)]
        public string Observacoes { get; set; }
        public Produto Produto { get; set; }
        public Almoxarifado Almoxarifado { get; set; }

    }
}
