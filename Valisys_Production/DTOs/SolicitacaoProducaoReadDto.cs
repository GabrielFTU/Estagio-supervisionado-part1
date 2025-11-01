using System;

namespace Valisys_Production.DTOs
{
    public class SolicitacaoProducaoReadDto
    {
        public Guid Id { get; set; }
        public string Codigo { get; set; }
        public decimal QuantidadeSolicitada { get; set; }
        public DateTime DataSolicitacao { get; set; }
        public string Status { get; set; }
        public Guid ProdutoId { get; set; }
        public string ProdutoNome { get; set; }
        public Guid UsuarioSolicitanteId { get; set; }
        public string UsuarioSolicitanteNome { get; set; }
        public Guid? UsuarioAprovadorId { get; set; }
        public string? UsuarioAprovadorNome { get; set; }
    }
}