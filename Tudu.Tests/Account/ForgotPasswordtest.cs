using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Teste_tasks.Controllers;      // ajuste se o namespace do controller for diferente
using Teste_tasks.Models;
using Teste_tasks.Services;
using Teste_tasks.ViewModels;        // onde está o ForgotPasswordViewModel
using Xunit;

namespace Tudu.Tests.Account
{
    public class ForgotPasswordTest
    {
        // ---------- 1. Cenário de SUCESSO ----------
        [Fact(DisplayName = "Envia e‑mail e retorna Ok")]
        public async Task ForgotPassword_UserFound_SendsEmail_ReturnsOk()
        {
            // Arrange ----------------------------------------------------------
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object,
                                                               null, null, null, null, null, null, null, null);

            var mockSignInManager = new Mock<SignInManager<Users>>(
                                        mockUserManager.Object,
                                        new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object,
                                        new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                                        null, null, null, null);

            var mockEmailSender = new Mock<ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            var user = new Users { Id = "u1", Email = "paulo@example.com" };

            mockUserManager.Setup(m => m.FindByEmailAsync(user.Email))
                           .ReturnsAsync(user);

            mockUserManager.Setup(m => m.GeneratePasswordResetTokenAsync(user))
                           .ReturnsAsync("token‑123");

            mockEmailSender.Setup(e => e.SendEmailAsync(
                                        user.Email,
                                        It.Is<string>(s => s.Contains("Redefinição de senha")),
                                        It.Is<string>(b => b.Contains("token=token‑123"))))
                           .Returns(Task.CompletedTask);

            var controller = new AccountController(mockUserManager.Object,
                                                   mockSignInManager.Object,
                                                   mockEmailSender.Object,
                                                   mockLogger.Object);

            var viewModel = new ForgotPasswordViewModel { Email = user.Email };

            // Act --------------------------------------------------------------
            var result = await controller.ForgotPassword(viewModel);

            // Assert -----------------------------------------------------------
            var ok = Assert.IsType<OkObjectResult>(result);
            var msg = ok.Value?.GetType().GetProperty("Message")?.GetValue(ok.Value)?.ToString();
            Assert.Contains("Instruções para redefinir a senha", msg);

            mockUserManager.Verify(m => m.FindByEmailAsync(user.Email), Times.Once);
            mockUserManager.Verify(m => m.GeneratePasswordResetTokenAsync(user), Times.Once);
            mockEmailSender.Verify(e => e.SendEmailAsync(user.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Once);

            // verifica se algum LogInformation com o texto esperado foi emitido
            mockLogger.Verify(l => l.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, _) => v.ToString()!.Contains("Reset link gerado")),
                null,
                It.IsAny<Func<It.IsAnyType, System.Exception?, string>>()),
                Times.Once);
        }

        // ---------- 2. Usuário NÃO encontrado ----------
        [Fact(DisplayName = "Usuário não encontrado retorna Ok sem e‑mail")]
        public async Task ForgotPassword_UserNotFound_ReturnsOk_NoEmailSent()
        {
            // Arrange
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object,
                                                               null, null, null, null, null, null, null, null);

            var mockSignInManager = new Mock<SignInManager<Users>>(
                                        mockUserManager.Object,
                                        new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object,
                                        new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                                        null, null, null, null);

            var mockEmailSender = new Mock<ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            const string email = "naoexiste@example.com";
            mockUserManager.Setup(m => m.FindByEmailAsync(email))
                           .ReturnsAsync((Users?)null);

            var controller = new AccountController(mockUserManager.Object,
                                                   mockSignInManager.Object,
                                                   mockEmailSender.Object,
                                                   mockLogger.Object);

            var vm = new ForgotPasswordViewModel { Email = email };

            // Act
            var result = await controller.ForgotPassword(vm);

            // Assert
            Assert.IsType<OkResult>(result);                 // 200 (sem corpo)
            mockEmailSender.Verify(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        // ---------- 3. ModelState inválido ----------
        [Fact(DisplayName = "Modelo inválido retorna BadRequest")]
        public async Task ForgotPassword_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object,
                                                               null, null, null, null, null, null, null, null);

            var mockSignInManager = new Mock<SignInManager<Users>>(
                                        mockUserManager.Object,
                                        new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object,
                                        new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                                        null, null, null, null);

            var mockEmailSender = new Mock<ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            var controller = new AccountController(mockUserManager.Object,
                                                   mockSignInManager.Object,
                                                   mockEmailSender.Object,
                                                   mockLogger.Object);

            // cria VM vazia e injeta erro no ModelState
            var vm = new ForgotPasswordViewModel { Email = "" };
            controller.ModelState.AddModelError("Email", "O campo Email é obrigatório.");

            // Act
            var result = await controller.ForgotPassword(vm);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            mockUserManager.Verify(m => m.FindByEmailAsync(It.IsAny<string>()), Times.Never);
            mockEmailSender.Verify(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }
    }
}
