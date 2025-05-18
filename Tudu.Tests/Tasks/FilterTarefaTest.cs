using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Teste_tasks.Controllers;
using Teste_tasks.Data;
using Teste_tasks.Models;
using Xunit;

namespace Tudu.Tests.Tasks
{
    public class FiltrarTarefasTest
    {
        // ---------- Helpers --------------------------------------------------

        private static AppDbContext NovaMemoria() =>
            new(new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"DbFiltrar_{Guid.NewGuid()}")
                .Options);

        private static TarefasController ControllerComUser(AppDbContext ctx, string userId)
        {
            var principal = new ClaimsPrincipal(
                new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            return new TarefasController(ctx)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = principal }
                }
            };
        }

        private static void PopularDados(AppDbContext ctx)
        {
            ctx.TarefaModel.AddRange(
                new TarefaModel
                {
                    Id = 1,
                    Titulo = "Estudar xUnit",
                    Descricao = "Ler docs",
                    DataInicio = DateTime.Today,
                    DataEntrega = DateTime.Today.AddDays(1),
                    StatusTarefa = "Aberta",
                    Prioridade = "Alta",
                    UserId = "userA"
                },
                new TarefaModel
                {
                    Id = 2,
                    Titulo = "Estudar EF Core",
                    Descricao = "Exemplos",
                    DataInicio = DateTime.Today,
                    DataEntrega = DateTime.Today,
                    StatusTarefa = "Concluída",
                    Prioridade = "Média",
                    UserId = "userA"
                },
                // Tarefa de outro usuário – não deve aparecer nunca
                new TarefaModel
                {
                    Id = 3,
                    Titulo = "Tarefa de outro",
                    Descricao = "Privada",
                    DataInicio = DateTime.Today,
                    DataEntrega = DateTime.Today,
                    StatusTarefa = "Aberta",
                    Prioridade = "Baixa",
                    UserId = "userB"
                });
            ctx.SaveChanges();
        }

        // ---------- Testes ---------------------------------------------------

        [Fact(DisplayName = "GET /api/Tarefas/filtrar retorna apenas as tarefas que correspondem ao filtro e ao usuário")]
        public async Task Filtrar_ComParametros_RetornaSomenteCorrespondentes()
        {
            // Arrange
            var ctx = NovaMemoria();
            PopularDados(ctx);
            var controller = ControllerComUser(ctx, "userA");

            // Act
            var result = await controller.Filtrar(titulo: "Estudar", dataEntrega: null,
                                                  status: "Aberta", prioridade: null);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            var lista = Assert.IsAssignableFrom<IEnumerable<TarefaModel>>(ok.Value);

            var tarefas = lista.ToList();
            Assert.Single(tarefas);
            Assert.Equal(1, tarefas[0].Id);
        }

        [Fact(DisplayName = "GET /api/Tarefas/filtrar sem parâmetros retorna todas as tarefas do usuário")]
        public async Task Filtrar_SemParametros_RetornaTodasDoUsuario()
        {
            // Arrange
            var ctx = NovaMemoria();
            PopularDados(ctx);
            var controller = ControllerComUser(ctx, "userA");

            // Act
            var result = await controller.Filtrar(null, null, null, null);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            var lista = Assert.IsAssignableFrom<IEnumerable<TarefaModel>>(ok.Value);

            var tarefas = lista.ToList();
            Assert.Equal(2, tarefas.Count);
            Assert.DoesNotContain(tarefas, t => t.UserId == "userB");
        }
    }
}
