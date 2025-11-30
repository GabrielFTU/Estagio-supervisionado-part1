using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class RoteiroEtapaDto
    {
        [Required]
        public Guid FaseProducaoId { get; set; }

        [Required]
        public int Ordem { get; set; }

        public int TempoDias { get; set; }
        public string? Instrucoes { get; set; }
    }

    public class RoteiroProducaoCreateDto
    {
        [Required]
        [MaxLength(50)]
        public string Codigo { get; set; }

        [MaxLength(20)]
        public string Versao { get; set; }

        public string? Descricao { get; set; }

        [Required]
        public Guid ProdutoId { get; set; }

        public List<RoteiroEtapaDto> Etapas { get; set; }
    }

    public class RoteiroProducaoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Codigo { get; set; }
        
        [MaxLength(20)]
        public string Versao { get; set; }
        public string? Descricao { get; set; }
        public bool Ativo { get; set; }
        public List<RoteiroEtapaDto> Etapas { get; set; }
    }

    public class RoteiroEtapaReadDto
    {
        public Guid Id { get; set; }
        public Guid FaseProducaoId { get; set; }
        public string FaseProducaoNome { get; set; }
        public int Ordem { get; set; }
        public int TempoDias { get; set; }
        public string Instrucoes { get; set; }
    }

    public class RoteiroProducaoReadDto
    {
        public Guid Id { get; set; }
        public string Codigo { get; set; }
        public string Versao { get; set; }
        public string Descricao { get; set; }
        public Guid ProdutoId { get; set; }
        public string ProdutoNome { get; set; }
        public bool Ativo { get; set; }
        public int TempoTotal { get; set; }
        public List<RoteiroEtapaReadDto> Etapas { get; set; }
    }
}