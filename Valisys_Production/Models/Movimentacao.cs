using System.ComponentModel.DataAnnotations;
using System;

namespace Valisys_Production.Models
{
    public class Movimentacao
    {
        [Key] 
        public int Id { get; set; } 

        public DateTime DataMovimentacao { get; set; } = DateTime.UtcNow;

        [MaxLength(500)]    
        public string Observacoes { get; set; } 

        public int OrdemDeProducaoId { get; set; }  
        public int AlmoxarifadoOrigemId { get; set; }
        public int AlmoxarifadoDestinoId { get; set; }
        public int UsuarioId { get; set; }

        public OrdemDeProducao OrdemDeProducao { get; set; }
        public Almoxarifado AlmoxarifadoOrigem { get; set; }
        public Almoxarifado AlmoxarifadoDestino { get; set; }
        public Usuario Usuario { get; set; }
    }
}
