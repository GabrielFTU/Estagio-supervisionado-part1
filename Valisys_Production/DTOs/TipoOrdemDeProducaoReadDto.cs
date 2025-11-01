using System;

namespace Valisys_Production.DTOs
{
    public class TipoOrdemDeProducaoReadDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Codigo { get; set; }
        public bool Ativo { get; set; }
    }
}