using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Teste_tasks.Controllers;
using Teste_tasks.Data;
using Teste_tasks.Models;
using Xunit;
using System.ComponentModel;

namespace Tudu.Tests.Tasks
{
    public class PutTarefaTest
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "Test_PutTarefa")
                .Options;

            var context = new AppDbContext(options);

            return context;
        }

        [Fact(DisplayName = "PUT /api/Tarefas/{id} atualiza tarefa existente do usuário e retorna NoContent")]
        public async Task PutTarefa_AtualizaTarefaExistente_RetornaNoContent()
        {
            // Arrange
            var context = GetInMemoryDbContext();

            var userId = "usuario-teste-put";
            // Tarefa inicial salva no banco
            var tarefaInicial = new TarefaModel
            {
                Id = 1,
                Titulo = "Título Original",
                Descricao = "Descrição Original",
                DataEntrega = System.DateTime.Now.AddDays(10),
                DataInicio = System.DateTime.Now,
                Prioridade = "Média",
                StatusTarefa = "Aberta",
                UserId = userId
            };

            context.TarefaModel.Add(tarefaInicial);
            await context.SaveChangesAsync();

            var controller = new TarefasController(context);

            // Simula usuário autenticado
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            // Nova tarefa para atualizar
            var tarefaAtualizada = new TarefaModel
            {
                Id = 1,
                Titulo = "Título Atualizado",
                Descricao = "Descrição Atualizada",
                DataEntrega = System.DateTime.Now.AddDays(15),
                Prioridade = "Alta",
                StatusTarefa = "Concluída",
                UserId = userId // pode ou não setar aqui, o controller não usa
            };

            // Act
            var result = await controller.PutTarefa(1, tarefaAtualizada);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var tarefaNoBanco = await context.TarefaModel.FindAsync(1);
            Assert.Equal("Título Atualizado", tarefaNoBanco.Titulo);
            Assert.Equal("Descrição Atualizada", tarefaNoBanco.Descricao);
            Assert.Equal("Alta", tarefaNoBanco.Prioridade);
            Assert.Equal("Concluída", tarefaNoBanco.StatusTarefa);
        }

        [Fact(DisplayName = "PUT /api/Tarefas/{id} retorna NotFound se tarefa não existe para o usuário")]
        public async Task PutTarefa_TarefaNaoExiste_RetornaNotFound()
        {
            // Arrange
            var context = GetInMemoryDbContext();

            var userId = "usuario-teste-put-naoexiste";

            var controller = new TarefasController(context);

            // Simula usuário autenticado
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var tarefaQualquer = new TarefaModel
            {
                Id = 99,
                Titulo = "Qualquer",
                Descricao = "Qualquer",
                DataEntrega = System.DateTime.Now,
                Prioridade = "Baixa",
                StatusTarefa = "Aberta",
                UserId = userId
            };

            // Act
            var result = await controller.PutTarefa(99, tarefaQualquer);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);

            // usando reflexão para ler a propriedade Message do tipo anônimo
            var msgProp = notFoundResult.Value!
                          .GetType()
                          .GetProperty("Message");
            var mensagem = msgProp?.GetValue(notFoundResult.Value) as string;

            Assert.Equal("Tarefa não encontrada ou acesso negado.", mensagem);

        }
    }
}
