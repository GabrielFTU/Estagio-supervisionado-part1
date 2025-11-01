using Microsoft.EntityFrameworkCore;
using Valisys_Production.Models;

namespace Valisys_Production.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        private static readonly Guid AdminProfileId = Guid.Parse("C0DE0000-0000-0000-0000-000000000001");
        private static readonly Guid UnitId = Guid.Parse("C0DE0000-0000-0000-0000-000000000002");
        private static readonly Guid KgId = Guid.Parse("C0DE0000-0000-0000-0000-000000000003");
        private static readonly Guid Phase1Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000004");
        private static readonly Guid SampleProductId = Guid.Parse("C0DE0000-0000-0000-0000-000000000005");
        private static readonly Guid SampleCategoryId = Guid.Parse("C0DE0000-0000-0000-0000-000000000006");
        private static readonly Guid SampleTipoOrdemDeProducaoId = Guid.Parse("C0DE0000-0000-0000-0000-000000000008");
        private static readonly Guid SampleAlmoxarifadoId = Guid.Parse("C0DE0000-0000-0000-0000-000000000009");

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

            // Seed Perfis
            modelBuilder.Entity<Perfil>().HasData(
                new Perfil { Id = AdminProfileId, Nome = "Administrador" },
                new Perfil { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000010"), Nome = "Gerente PCP" },
                new Perfil { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000011"), Nome = "Encarregado Producao" }
            );

            // Seed Categoria Produto
            modelBuilder.Entity<CategoriaProduto>().HasData(
                new CategoriaProduto { Id = SampleCategoryId, Nome = "Veículos Pesados", Descricao = "VP" }
            );

            // Seed Almoxarifado
            modelBuilder.Entity<Almoxarifado>().HasData(
                new Almoxarifado
                {
                    Id = SampleAlmoxarifadoId,
                    Nome = "Almoxarifado Geral",
                    Descricao = "Almoxarifado principal",
                    Localizacao = "Galpão 1",
                    Responsavel = "Sistema",
                    Contato = "(67) 99999-9999",
                    Email = "almoxarifado@empresa.com",
                    Ativo = true,
                    DataCadastro = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Unidades de Medida
            modelBuilder.Entity<UnidadeMedida>().HasData(
                new UnidadeMedida { Id = UnitId, Nome = "Unidade", Sigla = "UN" },
                new UnidadeMedida { Id = KgId, Nome = "Kilograma", Sigla = "KG" },
                new UnidadeMedida { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000012"), Nome = "Metro", Sigla = "M" }
            );

            // Seed Fases de Produção
            modelBuilder.Entity<FaseProducao>().HasData(
                new FaseProducao { Id = Phase1Id, Nome = "MONTAGEM INICIAL", Descricao = "Início da montagem do chassi.", Ordem = 1 },
                new FaseProducao { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000013"), Nome = "PINTURA", Descricao = "Área de preparação e pintura.", Ordem = 2 },
                new FaseProducao { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000014"), Nome = "MONTAGEM FINAL", Descricao = "Instalação de motor e acabamentos.", Ordem = 3 },
                new FaseProducao { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000015"), Nome = "TESTE DE QUALIDADE", Descricao = "Checagem final antes da expedição.", Ordem = 4 }
            );

            // Seed Tipo de Ordem de Produção
            modelBuilder.Entity<TipoOrdemDeProducao>().HasData(
                new TipoOrdemDeProducao { Id = SampleTipoOrdemDeProducaoId, Nome = "Normal", Descricao = "NOR" }
            );

            // Seed Produto
            modelBuilder.Entity<Produto>().HasData(
                new Produto
                {
                    Id = SampleProductId,
                    Nome = "Caminhão Alpha",
                    Descricao = "Caminhão de teste para Lote.",
                    CodigoInternoProduto = "CA-ALFA-001",
                    ControlarPorLote = true,
                    Ativo = true,
                    UnidadeMedidaId = UnitId,
                    CategoriaProdutoId = SampleCategoryId,
                    Observacoes = "Produto de teste para inicio do sistema",
                    DataCadastro = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Configurações de relacionamentos
            modelBuilder.Entity<OrdemDeProducao>()
                .HasOne(o => o.SolicitacaoProducao)
                .WithOne(s => s.OrdemDeProducao)
                .HasForeignKey<OrdemDeProducao>(o => o.SolicitacaoProducaoId)
                .IsRequired(false);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.OrdemDeProducao)
                .WithMany()
                .HasForeignKey(m => m.OrdemDeProducaoId)
                .IsRequired(false);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.AlmoxarifadoOrigem)
                .WithMany()
                .HasForeignKey(m => m.AlmoxarifadoOrigemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.AlmoxarifadoDestino)
                .WithMany()
                .HasForeignKey(m => m.AlmoxarifadoDestinoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movimentacao>()
                .HasOne(m => m.Usuario)
                .WithMany()
                .HasForeignKey(m => m.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SolicitacaoProducao>()
                .HasOne(s => s.Encarregado)
                .WithMany()
                .HasForeignKey(s => s.EncarregadoId)
                .IsRequired(false);

            modelBuilder.Entity<SolicitacaoProducao>()
                .HasMany(s => s.Itens)
                .WithOne(i => i.SolicitacaoProducao)
                .HasForeignKey(i => i.SolicitacaoProducaoId);
        }
    }
}