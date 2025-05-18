using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Teste_tasks.Controllers;
using Teste_tasks.Data;
using Teste_tasks.Models;
using Xunit;
using System.ComponentModel;

namespace Tudu.Tests.Tasks
{
    public class PostTarefaTest
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "Test_PostTarefa")
                .Options;

            var context = new AppDbContext(options);

            return context;
        }

        [Fact(DisplayName = "POST /api/Tarefas adiciona nova tarefa com UserId e retorna CreatedAtAction")]
        public async Task PostTarefa_AdicionaTarefaERetornaCreatedAtAction()
        {
            // Arrange
            var context = GetInMemoryDbContext();

            var controller = new TarefasController(context);

            // Simula usuário autenticado
            var userId = "usuario-teste-123";
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var novaTarefa = new TarefaModel
            {
                Titulo = "Teste Nova Tarefa",
                Descricao = "Descrição teste",
                DataEntrega = System.DateTime.Now.AddDays(5),
                DataInicio = System.DateTime.Now,
                Prioridade = "Alta",
                StatusTarefa = "Aberta"
            };

            // Act
            var result = await controller.PostTarefa(novaTarefa);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var tarefaRetornada = Assert.IsType<TarefaModel>(createdResult.Value);
            Assert.Equal(novaTarefa.Titulo, tarefaRetornada.Titulo);
            Assert.Equal(userId, tarefaRetornada.UserId);
            Assert.NotEqual(0, tarefaRetornada.Id); // Id gerado

            // Confirma que foi realmente adicionada no banco
            var tarefaNoBanco = await context.TarefaModel.FindAsync(tarefaRetornada.Id);
            Assert.NotNull(tarefaNoBanco);
            Assert.Equal(userId, tarefaNoBanco.UserId);
        }
    }
}
