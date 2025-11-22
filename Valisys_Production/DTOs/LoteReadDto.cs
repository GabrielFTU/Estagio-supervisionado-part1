using System;

namespace Valisys_Production.DTOs
{
    public class LoteReadDto
    {
        public Guid Id { get; set; }
        public string NumeroLote { get; set; }
        public DateTime DataFabricacao { get; set; }
        public DateTime? DataVencimento { get; set; }
        public bool Ativo { get; set; }
        public Guid ProdutoId { get; set; }
        public bool EmUso { get; set; }

    }
}