using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens; 
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;
using System.Linq;
using System.Text;
using Valisys_Production.Data;
using Valisys_Production.Helpers;
using Valisys_Production.Models;
using Valisys_Production.Repositories;
using Valisys_Production.Repositories.Interfaces;
using Valisys_Production.Services;
using Valisys_Production.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);


var key = Encoding.ASCII.GetBytes("fALjfDmfKT6Z2wj426wnM43R3Sc8zL92");

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}) 
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.SuppressModelStateInvalidFilter = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
  options.UseNpgsql(connectionString));


builder.Services.AddScoped<IFornecedorRepository, FornecedorRepository>();
builder.Services.AddScoped<IFornecedorService, FornecedorService>();
builder.Services.AddScoped<IAlmoxarifadoRepository, AlmoxarifadoRepository>();
builder.Services.AddScoped<IAlmoxarifadoService, AlmoxarifadoService>();
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<ILoteService, LoteService>();
builder.Services.AddScoped<ILoteRepository, LoteRepository>();
builder.Services.AddScoped<IPerfilRepository, PerfilRepository>();
builder.Services.AddScoped<IPerfilService, PerfilService>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IMovimentacaoRepository, MovimentacaoRepository>();
builder.Services.AddScoped<IMovimentacaoService, MovimentacaoService>();
builder.Services.AddScoped<ISolicitacaoProducaoRepository, SolicitacaoProducaoRepository>();
builder.Services.AddScoped<ISolicitacaoProducaoService, SolicitacaoProducaoService>();
builder.Services.AddScoped<IFaseProducaoRepository, FaseProducaoRepository>();
builder.Services.AddScoped<IFaseProducaoService, FaseProducaoService>();
builder.Services.AddScoped<ICategoriaProdutoRepository, CategoriaProdutoRepository>();
builder.Services.AddScoped<ICategoriaProdutoService, CategoriaProdutoService>();
builder.Services.AddScoped<IUnidadeMedidaRepository, UnidadeMedidaRepository>();
builder.Services.AddScoped<IUnidadeMedidaService, UnidadeMedidaService>();
builder.Services.AddScoped<ITipoOrdemDeProducaoRepository, TipoOrdemDeProducaoRepository>();
builder.Services.AddScoped<ITipoOrdemDeProducaoService, TipoOrdemDeProducaoService>();
builder.Services.AddScoped<IOrdemDeProducaoRepository, OrdemDeProducaoRepository>();
builder.Services.AddScoped<IOrdemDeProducaoService, OrdemDeProducaoService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPdfReportService, PdfReportService>();

builder.Services.AddAutoMapper(typeof(MappingProfiles));

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyAllowSpecificOrigins",
             builder =>
             {
                
                 builder.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
             });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// app.UseHttpsRedirection(); 

app.UseCors("MyAllowSpecificOrigins");


app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();