using System;

namespace Valisys_Production.DTOs
{
    public class LogSistemaReadDto
    {
        public Guid Id { get; set; }
        public Guid? UsuarioId { get; set; }
        public string UsuarioNome { get; set; }
        public string Acao { get; set; }
        public string Modulo { get; set; }
        public string Detalhes { get; set; }
        public DateTime DataHora { get; set; }
    }

    public class LogSistemaCreateDto
    {
        public Guid? UsuarioId { get; set; }
        public string Acao { get; set; }
        public string Modulo { get; set; }
        public string Detalhes { get; set; }
    }
}