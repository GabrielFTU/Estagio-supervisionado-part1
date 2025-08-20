using Microsoft.EntityFrameworkCore;
using Valisys_Production.Models;

namespace Valisys_Production.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // DbSets para as Entidades Principais
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<Almoxarifado> Almoxarifados { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Lote> Lotes { get; set; }
        public DbSet<OrdemDeProducao> OrdensDeProducao { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
        public DbSet<SolicitacaoProducao> SolicitacoesProducao { get; set; }

        // DbSets para as Entidades de Suporte
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Perfil> Perfis { get; set; }
        public DbSet<FaseProducao> FasesProducao { get; set; }
        public DbSet<CategoriaProduto> CategoriasProduto { get; set; }
        public DbSet<UnidadeMedida> UnidadesMedida { get; set; }
        public DbSet<TipoOrdemDeProducao> TiposDeOrdemDeProducao { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relacionamentos entre as classes
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Perfil)
                .WithMany(p => p.Usuarios)
                .HasForeignKey(u => u.PerfilId);

            modelBuilder.Entity<Produto>()
                .HasOne(p => p.UnidadeMedida)
                .WithMany(um => um.Produtos)
                .HasForeignKey(p => p.UnidadeMedidaId);

            modelBuilder.Entity<Produto>()
                .HasOne(p => p.CategoriaProduto)
                .WithMany(c => c.Produtos)
                .HasForeignKey(p => p.CategoriaProdutoId);

            modelBuilder.Entity<Lote>()
                .HasOne(l => l.Produto)
                .WithMany()
                .HasForeignKey(l => l.ProdutoId);

            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.Lote)
                .WithMany(l => l.OrdensDeProducao)
                .HasForeignKey(o => o.LoteId)
                .IsRequired(false); 

            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.Produto)
                .WithMany()
                .HasForeignKey(o => o.ProdutoId);

            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.Almoxarifado)
                .WithMany()
                .HasForeignKey(o => o.AlmoxarifadoId);

            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.FaseAtual)
                .WithMany(f => f.OrdensDeProducao)
                .HasForeignKey(o => o.FaseAtualId);

            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.TipoOrdemDeProducao)
                .WithMany(t => t.OrdensDeProducao)
                .HasForeignKey(o => o.TipoOrdemDeProducaoId); 

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

            modelBuilder.Entity<SolicitacaoProducao>()
                .HasOne(s => s.Encarregado)
                .WithMany()
                .HasForeignKey(s => s.EncarregadoId);

            modelBuilder.Entity<SolicitacaoProducao>()
                .HasOne(s => s.Produto)
                .WithMany()
                .HasForeignKey(s => s.ProdutoId);

            modelBuilder.Entity<SolicitacaoProducao>()
                .HasOne(s => s.OrdemDeProducao)
                .WithMany()
                .HasForeignKey(s => s.OrdemDeProducaoId);
        }
    }
}