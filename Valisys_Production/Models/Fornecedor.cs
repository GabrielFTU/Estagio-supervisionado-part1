using System.ComponentModel.DataAnnotations;
using System.Net.NetworkInformation;

namespace Valisys_Production.Models   
{
    public enum TipoDocumento
    {
        CPF, CNPJ
    }
    public class Fornecedor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Nome { get; set; }    

        [Required]
        [MaxLength(20)] 
        public string Documento { get; set; }
        public TipoDocumento TipoDocumento { get; set; }

        [MaxLength(255)]
        public string Endereco { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(15)]
        public string Telefone { get; set; }

        public bool Ativo { get; set; } = true;
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        [MaxLength(500)]
        public string Observacoes { get; set; } 
    }
}
