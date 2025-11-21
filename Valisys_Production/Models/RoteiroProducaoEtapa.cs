using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.Models
{
    public class RoteiroProducaoEtapa
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid RoteiroProducaoId { get; set; }
        public RoteiroProducao RoteiroProducao { get; set; }

        public Guid FaseProducaoId { get; set; }
        public FaseProducao FaseProducao { get; set; }

        public int Ordem { get; set; }

        public int TempoDias { get; set; }

        [MaxLength(500)]
        public string? Instrucoes { get; set; }
    }
}