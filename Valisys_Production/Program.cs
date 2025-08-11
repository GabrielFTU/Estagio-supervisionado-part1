using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;
using Valisys_Production.Data;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services;
using Valisys_Production.Services.Interfaces;
using Valisys_Production.Repositories;
using Valisys_Production.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Registra os Repositórios
builder.Services.AddScoped<IFornecedorRepository, FornecedorRepository>();
builder.Services.AddScoped<IAlmoxarifadoRepository, AlmoxarifadoRepository>();
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<ILoteRepository, LoteRepository>();

// Registra os Serviços
builder.Services.AddScoped<IFornecedorService, FornecedorService>();
builder.Services.AddScoped<IAlmoxarifadoService, AlmoxarifadoService>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<ILoteService, LoteService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();