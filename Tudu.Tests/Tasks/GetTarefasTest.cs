using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Teste_tasks.Controllers; // Ajuste para o namespace do seu controller
using Teste_tasks.Data;       // Ajuste para o namespace do seu DbContext
using Teste_tasks.Models;     // Ajuste para o namespace dos seus models
using System.Collections.Generic;
using System.Linq;

namespace Teste_tasks.Tests.Tasks
{
    public class TarefasControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TarefasTestDb")
                .Options;

            var context = new AppDbContext(options);

            context.TarefaModel.RemoveRange(context.TarefaModel);
            context.SaveChanges();

            context.TarefaModel.AddRange(new List<TarefaModel>
            {
                new TarefaModel { Id = 1, Titulo = "Tarefa 1", UserId = "user1", StatusTarefa = "Aberta", Prioridade = "Alta", DataEntrega = DateTime.Now, DataInicio = DateTime.Now },
                new TarefaModel { Id = 2, Titulo = "Tarefa 2", UserId = "user2", StatusTarefa = "Em Progresso", Prioridade = "Média", DataEntrega = DateTime.Now, DataInicio = DateTime.Now }
            });
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetTarefas_RetornaApenasTarefasDoUsuarioAutenticado()
        {
            // Arrange
            var context = GetInMemoryDbContext();

            var controller = new TarefasController(context);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, "user1")
            }, "mock"));

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            // Act
            var result = await controller.GetTarefas();

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<TarefaModel>>>(result);
            var tarefas = Assert.IsAssignableFrom<IEnumerable<TarefaModel>>(okResult.Value);

            Assert.Single(tarefas);
            Assert.All(tarefas, t => Assert.Equal("user1", t.UserId));
        }
    }
}
