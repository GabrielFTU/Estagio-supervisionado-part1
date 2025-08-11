namespace Valisys_Production.Data
{
    using Microsoft.EntityFrameworkCore;    
    using Valisys_Production.Models;

    public class ApplicationDbContext : DbContext 
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) {
        } 
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<Almoxarifado> Almoxarifados { get; set; }
        public DbSet<Produto> Produtos { get; set; }

        public DbSet<Lote> Lotes { get; set; }


    }

}