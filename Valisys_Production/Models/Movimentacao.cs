using System.ComponentModel.DataAnnotations;
using System;

namespace Valisys_Production.Models
{
    public class Movimentacao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime DataMovimentacao { get; set; } = DateTime.UtcNow;
        [MaxLength(500)]
        public string? Observacoes { get; set; } 
        public Guid ProdutoId { get; set; }
        public Produto Produto { get; set; } 
        public decimal Quantidade { get; set; }
        public Guid OrdemDeProducaoId { get; set; }
        public OrdemDeProducao OrdemDeProducao { get; set; }

        public Guid AlmoxarifadoOrigemId { get; set; }
        public Almoxarifado AlmoxarifadoOrigem { get; set; }

        public Guid AlmoxarifadoDestinoId { get; set; }
        public Almoxarifado AlmoxarifadoDestino { get; set; }

        public Guid UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}