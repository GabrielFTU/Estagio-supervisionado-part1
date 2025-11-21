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
        private static readonly Guid AdminUserId = Guid.Parse("C0DE0000-0000-0000-0000-000000000000"); 


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
        public DbSet<FichaTecnica> FichasTecnicas { get; set; }
        public DbSet<FichaTecnicaItem> FichaTecnicaItens { get; set; }
        public DbSet<RoteiroProducao> RoteirosProducao { get; set; }
        public DbSet<RoteiroProducaoEtapa> RoteiroProducaoEtapas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Perfil>().HasData(
                new Perfil { Id = AdminProfileId, Nome = "Administrador" },
                new Perfil { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000010"), Nome = "Gerente PCP" },
                new Perfil { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000011"), Nome = "Encarregado Producao" }
            );

            modelBuilder.Entity<Usuario>().HasData(
                new Usuario
                {
                    Id = AdminUserId,
                    Nome = "Administrador Master",
                    Email = "admin@valisys.com",
                    // Hash da senha "Admin@123" (Gerado com BCrypt.Net.BCrypt.HashPassword("Admin@123"))
                    SenhaHash = "$2a$11$E8W15S33x7n568N46W9k6O66a0y.r9mO32y/R8k7V4t8s04D8C8u",
                    Ativo = true,
                    PerfilId = AdminProfileId,
                    DataCadastro = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<CategoriaProduto>().HasData(
                new CategoriaProduto { Id = SampleCategoryId, Nome = "Veículos Pesados", Descricao = "VP" }
            );

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

            modelBuilder.Entity<UnidadeMedida>().HasData(
                new UnidadeMedida { Id = UnitId, Nome = "Unidade", Sigla = "UN" },
                new UnidadeMedida { Id = KgId, Nome = "Kilograma", Sigla = "KG" },
                new UnidadeMedida { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000012"), Nome = "Metro", Sigla = "M" }
            );

            modelBuilder.Entity<FaseProducao>().HasData(
                new FaseProducao { Id = Phase1Id, Nome = "MONTAGEM INICIAL", Descricao = "Início da montagem do chassi.", Ordem = 1 },
                new FaseProducao { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000013"), Nome = "PINTURA", Descricao = "Área de preparação e pintura.", Ordem = 2 },
                new FaseProducao { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000014"), Nome = "MONTAGEM FINAL", Descricao = "Instalação de motor e acabamentos.", Ordem = 3 },
                new FaseProducao { Id = Guid.Parse("C0DE0000-0000-0000-0000-000000000015"), Nome = "TESTE DE QUALIDADE", Descricao = "Checagem final antes da expedição.", Ordem = 4 }
            );

            modelBuilder.Entity<TipoOrdemDeProducao>().HasData(
                new TipoOrdemDeProducao { Id = SampleTipoOrdemDeProducaoId, Nome = "Normal", Descricao = "NOR" }
            );

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

            modelBuilder.Entity<FichaTecnica>()
                .HasOne(f => f.Produto)
                .WithMany()
                .HasForeignKey(f => f.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<FichaTecnicaItem>()
                .HasOne(i => i.FichaTecnica)
                .WithMany(f => f.Itens)
                .HasForeignKey(i => i.FichaTecnicaId)
                .OnDelete(DeleteBehavior.Cascade); 

            modelBuilder.Entity<FichaTecnicaItem>()
                .HasOne(i => i.ProdutoComponente)
                .WithMany()
                .HasForeignKey(i => i.ProdutoComponenteId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<RoteiroProducao>()
                .HasOne(r => r.Produto)
                .WithMany()
                .HasForeignKey(r => r.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoteiroProducaoEtapa>()
                .HasOne(e => e.RoteiroProducao)
                .WithMany(r => r.Etapas)
                .HasForeignKey(e => e.RoteiroProducaoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoteiroProducaoEtapa>()
                .HasOne(e => e.FaseProducao)
                .WithMany()
                .HasForeignKey(e => e.FaseProducaoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoteiroProducao>()
                .HasOne(r => r.Produto)
                .WithMany()
                .HasForeignKey(r => r.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<RoteiroProducaoEtapa>()
                .HasOne(e => e.RoteiroProducao)
                .WithMany(r => r.Etapas)
                .HasForeignKey(e => e.RoteiroProducaoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RoteiroProducaoEtapa>()
                .HasOne(e => e.FaseProducao)
                .WithMany()
                .HasForeignKey(e => e.FaseProducaoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}