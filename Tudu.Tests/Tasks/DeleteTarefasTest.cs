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
    public class DeleteTarefasTest
    {
        // ---------- helpers --------------------------------------------------

        private static AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                          .UseInMemoryDatabase(databaseName: $"TarefasDb_{Guid.NewGuid()}")
                          .Options;

            return new AppDbContext(options);
        }

        private static TarefasController GetControllerWithUser(AppDbContext ctx, string userId)
        {
            // cria um usuário de Claims “logado”
            var claimsPrincipal = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[] { new Claim(ClaimTypes.NameIdentifier, userId) }));

            var controller = new TarefasController(ctx)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = claimsPrincipal }
                }
            };
            return controller;
        }

        // ---------- testes ---------------------------------------------------

        [Fact(DisplayName = "DELETE /api/Tarefas/{id} retorna 204 quando tarefa é do usuário")]
        public async Task DeleteTarefa_Sucesso_RetornaNoContent()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            const string userId = "userA";

            // cria tarefa que pertence ao usuário logado
            var tarefa = new TarefaModel
            {
                Id = 1,
                Titulo = "Estudar",
                Descricao = "Ler EF Core docs",
                DataInicio = DateTime.Today,
                DataEntrega = DateTime.Today.AddDays(2),
                StatusTarefa = "Aberta",
                Prioridade = "Alta",
                UserId = userId
            };
            context.TarefaModel.Add(tarefa);
            context.SaveChanges();

            var controller = GetControllerWithUser(context, userId);

            // Act
            var result = await controller.DeleteTarefa(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.False(context.TarefaModel.Any(t => t.Id == 1));  // realmente excluiu
        }

        [Fact(DisplayName = "DELETE /api/Tarefas/{id} retorna 404 se tarefa não pertence ao usuário")]
        public async Task DeleteTarefa_TarefaNaoEncontrada_RetornaNotFound()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            const string userId = "userA";
            const string otherUser = "userB";

            // tarefa de outro usuário
            context.TarefaModel.Add(new TarefaModel
            {
                Id = 2,
                Titulo = "Comprar pão",
                Descricao = "Padaria",
                DataInicio = DateTime.Today,
                DataEntrega = DateTime.Today,
                StatusTarefa = "Aberta",
                Prioridade = "Baixa",
                UserId = otherUser
            });
            context.SaveChanges();

            var controller = GetControllerWithUser(context, userId);

            // Act
            var result = await controller.DeleteTarefa(2);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            var msg = notFound.Value?.GetType().GetProperty("Message")?
                                         .GetValue(notFound.Value)?.ToString();

            Assert.Equal("Tarefa não encontrada ou acesso negado.", msg);
        }
    }
}
