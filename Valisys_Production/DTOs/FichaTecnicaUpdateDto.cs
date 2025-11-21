using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class FichaTecnicaUpdateDto
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Codigo { get; set; }
        [MaxLength(100)]
        public string Versao { get; set; }
        [MaxLength(500)]
        public string Descricao { get; set; }
        public bool Ativa { get; set; }
        public List<FichaTecnicaItemDto> Itens { get; set; }
    }
}