namespace Valisys_Production.DTOs
{
    public class FichaTecnicaItemReadDto
    {
        public Guid Id { get; set; }
        public Guid ProdutoComponenteId { get; set; }
        public string ProdutoComponenteNome { get; set; }
        public string ProdutoComponenteCodigo { get; set; }
        public string UnidadeMedida { get; set; }
        public decimal Quantidade { get; set; }
        public decimal PerdaPercentual { get; set; }
    }

    public class FichaTecnicaReadDto
    {
        public Guid Id { get; set; }
        public Guid ProdutoId { get; set; }
        public string ProdutoNome { get; set; }
        public string Codigo { get; set; }
        public string Versao { get; set; }
        public string Descricao { get; set; }
        public bool Ativa { get; set; }
        public List<FichaTecnicaItemReadDto> Itens { get; set; }
    }
}