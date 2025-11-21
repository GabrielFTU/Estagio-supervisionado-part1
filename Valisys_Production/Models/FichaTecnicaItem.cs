using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models
{
    public class FichaTecnicaItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid FichaTecnicaId { get; set; }
        public FichaTecnica FichaTecnica { get; set; }
        public Guid ProdutoComponenteId { get; set; }
        public Produto ProdutoComponente { get; set; }
        public decimal Quantidade { get; set; }
        public decimal PerdaPercentual { get; set; } = 0;
    }
}