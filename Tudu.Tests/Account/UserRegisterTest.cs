using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Teste_tasks.Controllers;
using Teste_tasks.Models;
using Teste_tasks.ViewModels;
using Teste_tasks.Services;
using Xunit;
using Microsoft.AspNetCore.Mvc.Routing;

namespace Tudu.Tests.Account
{
    public class UserRegisterTest
    {
        [Fact(DisplayName = "Registra com sucesso um usuário")]
        public async Task Success()
        {
            // ---------- Arrange ----------

            // 1) Mocks do Identity
            var userStore = new Mock<IUserStore<Users>>();
            var userManager = new Mock<UserManager<Users>>(userStore.Object, null, null, null, null, null, null, null, null);
            var signInMgr = new Mock<SignInManager<Users>>(userManager.Object,
                                                             new Mock<IHttpContextAccessor>().Object,
                                                             new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                                                             null, null, null, null);

            var emailSender = new Mock<ICustomEmailSender>();
            var logger = new Mock<ILogger<AccountController>>();

            // 2) Comportamento dos métodos
            userManager.Setup(m => m.CreateAsync(It.IsAny<Users>(), It.IsAny<string>()))
                       .ReturnsAsync(IdentityResult.Success);

            userManager.Setup(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<Users>()))
                       .ReturnsAsync("fake-token");

            emailSender.Setup(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                       .Returns(Task.CompletedTask);

            // 3) Instancia o controller
            var controller = new AccountController(userManager.Object,
                                                   signInMgr.Object,
                                                   emailSender.Object,
                                                   logger.Object);

            // HttpContext para Request.Scheme
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
            controller.ControllerContext.HttpContext.Request.Scheme = "https";

            // UrlHelper mockado
            var urlHelper = new Mock<IUrlHelper>();
            urlHelper.Setup(u => u.Action(It.IsAny<UrlActionContext>()))
                     .Returns("https://fake/confirm");
            controller.Url = urlHelper.Object;

            // 4) Modelo de entrada
            var viewModel = new RegisterViewModel
            {
                Name = "Paulo",
                Email = "paulo@example.com",
                Password = "Senha123!",
                DataNascimento = DateTime.Today.AddYears(-20)
            };

            // ---------- Act ----------
            var result = await controller.Register(viewModel);

            // ---------- Assert ----------
            var ok = Assert.IsType<OkObjectResult>(result);

            // acessa a propriedade Message (tipo anônimo) via reflexão
            var messageProp = ok.Value!.GetType().GetProperty("Message");
            var message = messageProp?.GetValue(ok.Value) as string;

            Assert.NotNull(message);
            Assert.Contains("Usuário registrado com sucesso", message!);

            userManager.Verify(m => m.CreateAsync(It.IsAny<Users>(), viewModel.Password), Times.Once);
            userManager.Verify(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<Users>()), Times.Once);
            emailSender.Verify(e => e.SendEmailAsync(viewModel.Email,
                                                     It.IsAny<string>(),
                                                     It.Is<string>(s => s.Contains("Confirmar E-mail"))),
            Times.Once);
        }
    }
}
