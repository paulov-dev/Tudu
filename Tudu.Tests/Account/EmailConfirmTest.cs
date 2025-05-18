using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;
using Teste_tasks.Controllers;
using Teste_tasks.Models;
using Xunit;

namespace Tudu.Tests.Account
{
    public class ConfirmEmailTest
    {
        [Fact(DisplayName = "Email confirmado com sucesso")]
        public async Task ConfirmEmail_Success_ReturnsOk()
        {
            // Arrange
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object, null, null, null, null, null, null, null, null);

            var mockSignInManager = new Mock<SignInManager<Users>>(
                mockUserManager.Object,
                new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object,
                new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                null, null, null, null);

            var mockEmailSender = new Mock<Teste_tasks.Services.ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            var user = new Users
            {
                Id = "userId123",
                Email = "paulo@example.com"
            };

            mockUserManager.Setup(um => um.FindByIdAsync(user.Id)).ReturnsAsync(user);

            mockUserManager.Setup(um => um.ConfirmEmailAsync(user, "validToken"))
                .ReturnsAsync(IdentityResult.Success);

            var controller = new AccountController(mockUserManager.Object, mockSignInManager.Object, mockEmailSender.Object, mockLogger.Object);

            // Act
            var result = await controller.ConfirmEmail(user.Id, "validToken");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var message = okResult.Value?.GetType().GetProperty("Message")?.GetValue(okResult.Value)?.ToString();

            Assert.NotNull(message);
            Assert.Contains("Email confirmado com sucesso", message);

            mockUserManager.Verify(um => um.FindByIdAsync(user.Id), Times.Once);
            mockUserManager.Verify(um => um.ConfirmEmailAsync(user, "validToken"), Times.Once);
        }

        [Fact(DisplayName = "Usuário não encontrado")]
        public async Task ConfirmEmail_UserNotFound_ReturnsNotFound()
        {
            // Arrange
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object, null, null, null, null, null, null, null, null);

            var mockSignInManager = new Mock<SignInManager<Users>>(
                mockUserManager.Object,
                new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object,
                new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                null, null, null, null);

            var mockEmailSender = new Mock<Teste_tasks.Services.ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            mockUserManager.Setup(um => um.FindByIdAsync("invalidUserId")).ReturnsAsync((Users?)null);

            var controller = new AccountController(mockUserManager.Object, mockSignInManager.Object, mockEmailSender.Object, mockLogger.Object);

            // Act
            var result = await controller.ConfirmEmail("invalidUserId", "anyToken");

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Usuário não encontrado.", notFoundResult.Value);

            mockUserManager.Verify(um => um.FindByIdAsync("invalidUserId"), Times.Once);
            mockUserManager.Verify(um => um.ConfirmEmailAsync(It.IsAny<Users>(), It.IsAny<string>()), Times.Never);
        }

        [Fact(DisplayName = "Falha na confirmação")]
        public async Task ConfirmEmail_Fail_ReturnsBadRequest()
        {
            // Arrange
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object, null, null, null, null, null, null, null, null);

            var mockSignInManager = new Mock<SignInManager<Users>>(
                mockUserManager.Object,
                new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object,
                new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                null, null, null, null);

            var mockEmailSender = new Mock<Teste_tasks.Services.ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            var user = new Users { Id = "userId123" };

            mockUserManager.Setup(um => um.FindByIdAsync(user.Id)).ReturnsAsync(user);

            mockUserManager.Setup(um => um.ConfirmEmailAsync(user, "invalidToken"))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Token inválido" }));

            var controller = new AccountController(mockUserManager.Object, mockSignInManager.Object, mockEmailSender.Object, mockLogger.Object);

            // Act
            var result = await controller.ConfirmEmail(user.Id, "invalidToken");

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Falha ao confirmar o email.", badRequestResult.Value);

            mockUserManager.Verify(um => um.FindByIdAsync(user.Id), Times.Once);
            mockUserManager.Verify(um => um.ConfirmEmailAsync(user, "invalidToken"), Times.Once);
        }
    }
}
