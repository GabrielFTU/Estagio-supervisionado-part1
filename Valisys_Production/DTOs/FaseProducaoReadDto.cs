using System;

namespace Valisys_Production.DTOs
{
    public class FaseProducaoReadDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public int Ordem { get; set; }
        public int TempoPadraoDias { get; set; }
        public bool Ativo { get; set; }
    }
}