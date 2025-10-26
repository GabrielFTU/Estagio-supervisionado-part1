using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace Valisys_Production.Models
{
    public enum StatusLote
    {
           Pendente = 1,
           Concluido = 2,
           Cancelado = 3,
           EmProducao = 4
    }
    public class Lote
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string CodigoLote { get; set; }
        [MaxLength(500)]
        public string Descricao { get; set; }   
        public StatusLote statusLote { get; set; } = StatusLote.Pendente;
        public DateTime DataAbertura { get; set; } = DateTime.UtcNow;  
        public DateTime? DataConclusao { get; set; } = null;
        [MaxLength(500)]
        public string Observacoes { get; set; }
        
        //FKs
        public int ProdutoId { get; set; }  
        public Produto Produto { get; set; }
        public ICollection<OrdemDeProducao> OrdensDeProducao { get; set; } 
        public int AlmoxarifadoId { get; set; }
        public Almoxarifado Almoxarifado { get; set; }


    }
}
