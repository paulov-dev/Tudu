using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Teste_tasks.Controllers;
using Teste_tasks.Models;
using Teste_tasks.ViewModels;
using Xunit;

namespace Tudu.Tests.Account
{
    public class UserLoginTest
    {
        [Fact(DisplayName = "Realiza login com sucesso")]
        public async Task Login_Success_ReturnsOk()
        {
            // Arrange
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object, null, null, null, null, null, null, null, null);
            var mockSignInManager = new Mock<SignInManager<Users>>(
                mockUserManager.Object,
                new Mock<IHttpContextAccessor>().Object,
                new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                null, null, null, null);

            var mockEmailSender = new Mock<Teste_tasks.Services.ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            var user = new Users
            {
                Email = "paulo@example.com",
                EmailConfirmed = true
            };

            // Setup FindByEmailAsync para retornar o usuário
            mockUserManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);

            // Setup IsEmailConfirmedAsync para retornar true
            mockUserManager.Setup(um => um.IsEmailConfirmedAsync(user)).ReturnsAsync(true);

            // Setup PasswordSignInAsync para retornar sucesso
            mockSignInManager.Setup(sm => sm.PasswordSignInAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>(), false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            var controller = new AccountController(mockUserManager.Object, mockSignInManager.Object, mockEmailSender.Object, mockLogger.Object);

            // Simular o ControllerContext necessário para Request.Scheme, se precisar (opcional)
            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext()
            };

            var loginModel = new LoginViewModel
            {
                Email = "paulo@example.com",
                Password = "Senha123!",
                RememberMe = true
            };

            // Act
            var result = await controller.Login(loginModel);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var responseMessage = okResult.Value?.GetType().GetProperty("Message")?.GetValue(okResult.Value)?.ToString();

            Assert.NotNull(responseMessage);
            Assert.Contains("Login realizado com sucesso", responseMessage);

            // Verifica chamadas
            mockUserManager.Verify(um => um.FindByEmailAsync(loginModel.Email), Times.Once);
            mockUserManager.Verify(um => um.IsEmailConfirmedAsync(user), Times.Once);
            mockSignInManager.Verify(sm => sm.PasswordSignInAsync(loginModel.Email, loginModel.Password, loginModel.RememberMe, false), Times.Once);
        }
    }
}
