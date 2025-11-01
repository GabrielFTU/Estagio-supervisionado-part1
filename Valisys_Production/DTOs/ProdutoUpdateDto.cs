﻿using System;
using System.ComponentModel.DataAnnotations;

namespace Valisys_Production.DTOs
{
    public class ProdutoUpdateDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O código do produto é obrigatório.")]
        [StringLength(50)]
        public string Codigo { get; set; }

        [Required(ErrorMessage = "O nome do produto é obrigatório.")]
        [StringLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O estoque mínimo é obrigatório.")]
        [Range(0, double.MaxValue)]
        public decimal EstoqueMinimo { get; set; }

        public bool ControlarPorLote { get; set; }

        public bool Ativo { get; set; }

        [Required]
        public Guid CategoriaProdutoId { get; set; }

        [Required]
        public Guid UnidadeMedidaId { get; set; }

        public Guid? AlmoxarifadoEstoqueId { get; set; }
    }
}