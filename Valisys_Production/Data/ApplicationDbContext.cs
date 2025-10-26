using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using System.Runtime.InteropServices;
using Valisys_Production.Models;

namespace Valisys_Production.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

       
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<Almoxarifado> Almoxarifados { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<OrdemDeProducao> OrdensDeProducao { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
        public DbSet<SolicitacaoProducao> SolicitacoesProducao { get; set; }
        public DbSet<SolicitacaoProducaoItem> SolicitacaoProducaoItens { get; set; }

     
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Perfil> Perfis { get; set; }
        public DbSet<FaseProducao> FasesProducao { get; set; }
        public DbSet<CategoriaProduto> CategoriasProduto { get; set; }
        public DbSet<UnidadeMedida> UnidadesMedida { get; set; }
        public DbSet<TipoOrdemDeProducao> TiposDeOrdemDeProducao { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Perfil>().HasData(
                new Perfil { Id = Guid.NewGuid(), Nome = "Administrador" },
                new Perfil { Id = Guid.NewGuid(), Nome = "Gerente PCP" },
                new Perfil { Id = Guid.NewGuid(), Nome = "Encarregado Producao" }
            );

            // --- 2. SEEDING PARA UNIDADES DE MEDIDA ---
            modelBuilder.Entity<UnidadeMedida>().HasData(
                new UnidadeMedida { Id = Guid.NewGuid(), Nome = "Unidade", Sigla = "UN" },
                new UnidadeMedida { Id = Guid.NewGuid(), Nome = "Kilograma", Sigla = "KG" },
                new UnidadeMedida { Id = Guid.NewGuid(), Nome = "Metro", Sigla = "M" }
            );

            // --- 3. SEEDING PARA FASES DE PRODUÇÃO ---
            modelBuilder.Entity<FaseProducao>().HasData(
                new FaseProducao { Id = Guid.NewGuid(), Nome = "MONTAGEM INICIAL", Descricao = "Início da montagem do chassi.", Ordem = 1 },
                new FaseProducao { Id = Guid.NewGuid(), Nome = "PINTURA", Descricao = "Área de preparação e pintura.", Ordem = 2 },
                new FaseProducao { Id = Guid.NewGuid(), Nome = "MONTAGEM FINAL", Descricao = "Instalação de motor e acabamentos.", Ordem = 3 },
                new FaseProducao { Id = Guid.NewGuid(), Nome = "TESTE DE QUALIDADE", Descricao = "Checagem final antes da expedição.", Ordem = 4 }
            );
            modelBuilder.Entity<Produto>().HasData(
            new Produto
            {
                Id = Guid.NewGuid(),
                Nome = "Caminhão Alpha",
                Descricao = "Caminhão de teste para Lote.",
                CodigoInternoProduto = "CA-ALFA-001",
                ControlarPorLote = true, // Crucial para testar a regra
                Ativo = true,
                UnidadeMedidaId = 1,
                CategoriaProdutoId = 1,
                Observacoes = "Produto de teste para inicio do sistema"
            }
            );
            // Relacionamento Usuario e Perfil (1:N)
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Perfil)
                .WithMany(p => p.Usuarios)
                .HasForeignKey(u => u.PerfilId);

            // Relacionamento Produto e UnidadeMedida (1:N)
            modelBuilder.Entity<Produto>()
                .HasOne(p => p.UnidadeMedida)
                .WithMany(um => um.Produtos)
                .HasForeignKey(p => p.UnidadeMedidaId);

            // Relacionamento Produto e CategoriaProduto (1:N)
            modelBuilder.Entity<Produto>()
                .HasOne(p => p.CategoriaProduto)
                .WithMany(c => c.Produtos)
                .HasForeignKey(p => p.CategoriaProdutoId);

            // Relacionamento Lote e Produto (1:N)
            modelBuilder.Entity<Lote>()
                .HasOne(l => l.Produto)
                .WithMany()
                .HasForeignKey(l => l.ProdutoId);

            // Relacionamento OrdemDeProducao e Lote (1:N)
            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.Lote)
                .WithMany(l => l.OrdensDeProducao)
                .HasForeignKey(o => o.LoteId)
                .IsRequired(false);

            // Relacionamento OrdemDeProducao e Produto (1:N)
            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.Produto)
                .WithMany()
                .HasForeignKey(o => o.ProdutoId);

            // Relacionamento OrdemDeProducao e Almoxarifado (1:N)
            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.Almoxarifado)
                .WithMany()
                .HasForeignKey(o => o.AlmoxarifadoId);

            // Relacionamento OrdemDeProducao e FaseProducao (1:N)
            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.FaseAtual)
                .WithMany(f => f.OrdensDeProducao)
                .HasForeignKey(o => o.FaseAtualId);

            // Relacionamento OrdemDeProducao e TipoOrdemDeProducao (1:N)
            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.TipoOrdemDeProducao)
                .WithMany(t => t.OrdensDeProducao)
                .HasForeignKey(o => o.TipoOrdemDeProducaoId);

            // Relacionamento 1:1 entre OrdemDeProducao e SolicitacaoProducao (1:1
            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.SolicitacaoProducao)
                .WithOne(s => s.OrdemDeProducao)
                .HasForeignKey<OrdemDeProducao>(o => o.SolicitacaoProducaoId);

            // Relacionamento Movimentacao (N:1)
            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.OrdemDeProducao)
                .WithMany()
                .HasForeignKey(m => m.OrdemDeProducaoId);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.AlmoxarifadoOrigem)
                .WithMany()
                .HasForeignKey(m => m.AlmoxarifadoOrigemId);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.AlmoxarifadoDestino)
                .WithMany()
                .HasForeignKey(m => m.AlmoxarifadoDestinoId);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.Usuario)
                .WithMany()
                .HasForeignKey(m => m.UsuarioId);

            // Relacionamento SolicitacaoProducao (N:1)
            modelBuilder.Entity<SolicitacaoProducao>()
                .HasOne(s => s.Encarregado)
                .WithMany()
                .HasForeignKey(s => s.EncarregadoId);

            // Relacionamento SolicitacaoProducao e Itens (1:N)
            modelBuilder.Entity<SolicitacaoProducao>()
                .HasMany(s => s.Itens)
                .WithOne(i => i.SolicitacaoProducao)
                .HasForeignKey(i => i.SolicitacaoProducaoId);



        }
    }
}