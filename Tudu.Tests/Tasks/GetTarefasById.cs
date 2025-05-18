using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Teste_tasks.Controllers;
using Teste_tasks.Data;
using Teste_tasks.Models;

namespace Tudu.Tests.Tasks
{
    public class GetTarefasByIdTest
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            var context = new AppDbContext(options);

            context.TarefaModel.RemoveRange(context.TarefaModel);
            context.SaveChanges();

            context.TarefaModel.AddRange(new List<TarefaModel>
            {
                new TarefaModel { Id = 1, Titulo = "Tarefa 1", UserId = "user1", StatusTarefa = "Aberta", Prioridade = "Alta", DataEntrega = System.DateTime.Now, DataInicio = System.DateTime.Now },
                new TarefaModel { Id = 2, Titulo = "Tarefa 2", UserId = "user2", StatusTarefa = "Em Progresso", Prioridade = "Média", DataEntrega = System.DateTime.Now, DataInicio = System.DateTime.Now }
            });

            context.SaveChanges();

            return context;
        }

        [Fact(DisplayName = "Deve retornar a tarefa quando ela existir e o usuário tiver acesso")]
        public async Task GetTarefa_RetornaTarefaQuandoExisteEUsuarioTemAcesso()
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
                HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext() { User = user }
            };

            // Act
            var result = await controller.GetTarefa(1);

            // Assert
            var okResult = Assert.IsType<ActionResult<TarefaModel>>(result);
            var tarefa = Assert.IsType<TarefaModel>(okResult.Value);

            Assert.Equal(1, tarefa.Id);
            Assert.Equal("user1", tarefa.UserId);
        }

        [Fact(DisplayName = "Deve retornar NotFound quando tarefa não existir ou usuário não tiver acesso")]
        public async Task GetTarefa_RetornaNotFoundQuandoNaoExisteOuUsuarioSemAcesso()
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
                HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext() { User = user }
            };

            // Act
            var result = await controller.GetTarefa(2);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal(404, notFoundResult.StatusCode);
        }
    }
}
