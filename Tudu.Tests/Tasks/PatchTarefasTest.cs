using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Teste_tasks.Controllers;
using Teste_tasks.Data;
using Teste_tasks.Models;
using Xunit;

namespace Tudu.Tests.Tasks
{
    public class PatchTarefaStatusTest
    {
        private static AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                          .UseInMemoryDatabase(Guid.NewGuid().ToString())
                          .Options;

            return new AppDbContext(options);
        }

        private static TarefasController GetControllerWithUser(AppDbContext ctx, string userId)
        {
            var controller = new TarefasController(ctx);

            // injeta usuário autenticado no HttpContext
            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[] { new Claim(ClaimTypes.NameIdentifier, userId) }, "TestAuth"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            return controller;
        }

        [Fact(DisplayName = "PATCH /api/Tarefas/{id}/status retorna 204 quando atualiza com sucesso")]
        public async Task AtualizarStatus_Sucesso_RetornaNoContent()
        {
            // ---------- Arrange ----------
            var userId = "user123";
            var context = GetInMemoryDbContext();

            var tarefa = new TarefaModel
            {
                Id = 1,
                Titulo = "Ler documentação xUnit",
                Descricao = "Estudar assertions",
                DataInicio = DateTime.Today,
                DataEntrega = DateTime.Today.AddDays(2),
                StatusTarefa = "Pendente",
                Prioridade = "Normal",
                UserId = userId
            };

            context.TarefaModel.Add(tarefa);
            context.SaveChanges();

            var controller = GetControllerWithUser(context, userId);
            var request = new AtualizarStatusRequest { Status = "Concluída" };

            // ---------- Act ----------
            var result = await controller.AtualizarStatus(1, request);

            // ---------- Assert ----------
            Assert.IsType<NoContentResult>(result);

            var tarefaAtualizada = await context.TarefaModel.FindAsync(1);
            Assert.Equal("Concluída", tarefaAtualizada?.StatusTarefa);
        }

        [Fact(DisplayName = "PATCH /api/Tarefas/{id}/status retorna 404 se tarefa não pertence ao usuário")]
        public async Task AtualizarStatus_TarefaNaoEncontrada_RetornaNotFound()
        {
            // ---------- Arrange ----------
            var context = GetInMemoryDbContext();
            var controller = GetControllerWithUser(context, userId: "userABC");

            var request = new AtualizarStatusRequest { Status = "Concluída" };

            // ---------- Act ----------
            var result = await controller.AtualizarStatus(99, request);

            // ---------- Assert ----------
            var notFound = Assert.IsType<NotFoundObjectResult>(result);

            // acessa "Message" via reflexão
            var msgProp = notFound.Value?.GetType().GetProperty("Message");
            var message = msgProp?.GetValue(notFound.Value)?.ToString();

            Assert.Equal("Tarefa não encontrada ou acesso negado.", message);
        }
    }
}
