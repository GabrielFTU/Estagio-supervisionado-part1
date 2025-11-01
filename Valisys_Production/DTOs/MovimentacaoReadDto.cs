namespace Valisys_Production.DTOs
{
    public class MovimentacaoReadDto
    {
        public Guid Id { get; set; }
        public decimal Quantidade { get; set; }
        public DateTime DataMovimentacao { get; set; }
        public string Observacoes { get; set; }
        public string ProdutoNome { get; set; }
        public string AlmoxarifadoOrigemNome { get; set; }
        public string AlmoxarifadoDestinoNome { get; set; }
        public string UsuarioNome { get; set; }
        public Guid? OrdemDeProducaoId { get; set; }
    }
}