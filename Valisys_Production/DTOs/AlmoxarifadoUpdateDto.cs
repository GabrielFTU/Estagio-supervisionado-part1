using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class AlmoxarifadoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O nome do almoxarifado é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [StringLength(200)]
        public string Localizacao { get; set; }

        public bool Ativo { get; set; }
    }
}