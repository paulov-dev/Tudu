using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Teste_tasks.Controllers;
using Teste_tasks.Models;
using Teste_tasks.Services;
using Teste_tasks.ViewsModels;
using Xunit;

namespace Tudu.Tests.Account
{
    public class ResetPasswordTest
    {
        // ---------- 1. Cenário de SUCESSO ----------
        [Fact(DisplayName = "Redefine senha e retorna Ok")]
        public async Task ResetPassword_UserFound_TokenValid_ReturnsOk()
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

            mockUserManager.Setup(m => m.ResetPasswordAsync(user, "valid-token", "NovaSenha1!"))
                           .ReturnsAsync(IdentityResult.Success);

            var controller = new AccountController(mockUserManager.Object,
                                                   mockSignInManager.Object,
                                                   mockEmailSender.Object,
                                                   mockLogger.Object);

            var vm = new ResetPasswordViewModel
            {
                Email = user.Email,
                Token = "valid-token",
                NewPassword = "NovaSenha1!"
            };

            // Act --------------------------------------------------------------
            var result = await controller.ResetPassword(vm);

            // Assert -----------------------------------------------------------
            var ok = Assert.IsType<OkObjectResult>(result);
            var msg = ok.Value?.GetType().GetProperty("Message")?.GetValue(ok.Value)?.ToString();
            Assert.Contains("Senha redefinida com sucesso", msg);

            mockUserManager.Verify(m => m.FindByEmailAsync(user.Email), Times.Once);
            mockUserManager.Verify(m => m.ResetPasswordAsync(user, vm.Token, vm.NewPassword), Times.Once);
        }

        // ---------- 2. Usuário NÃO encontrado ----------
        [Fact(DisplayName = "Usuário não encontrado retorna BadRequest")]
        public async Task ResetPassword_UserNotFound_ReturnsBadRequest()
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

            var vm = new ResetPasswordViewModel
            {
                Email = email,
                Token = "qualquer-token",
                NewPassword = "NovaSenha1!"
            };

            // Act
            var result = await controller.ResetPassword(vm);

            // Assert
            var badReq = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Usuário não encontrado.", badReq.Value);

            mockUserManager.Verify(m => m.ResetPasswordAsync(It.IsAny<Users>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        // ---------- 3. Token inválido / falha de redefinição ----------
        [Fact(DisplayName = "ResetPassword token inválido retorna BadRequest")]
        public async Task ResetPassword_TokenInvalid_ReturnsBadRequest()
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

            var user = new Users { Id = "u1", Email = "paulo@example.com" };

            mockUserManager.Setup(m => m.FindByEmailAsync(user.Email))
                           .ReturnsAsync(user);

            mockUserManager.Setup(m => m.ResetPasswordAsync(user, "invalid-token", "NovaSenha1!"))
                           .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Token inválido" }));

            var controller = new AccountController(mockUserManager.Object,
                                                   mockSignInManager.Object,
                                                   mockEmailSender.Object,
                                                   mockLogger.Object);

            var vm = new ResetPasswordViewModel
            {
                Email = user.Email,
                Token = "invalid-token",
                NewPassword = "NovaSenha1!"
            };

            // Act
            var result = await controller.ResetPassword(vm);

            // Assert
            var badReq = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badReq.Value);   // contém os erros do Identity

            mockUserManager.Verify(m => m.ResetPasswordAsync(user, vm.Token, vm.NewPassword), Times.Once);
        }

        // ---------- 4. ModelState inválido ----------
        [Fact(DisplayName = "Modelo inválido retorna BadRequest")]
        public async Task ResetPassword_InvalidModel_ReturnsBadRequest()
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

            var vm = new ResetPasswordViewModel
            {
                Email = "x@x.com",
                Token = "",
                NewPassword = ""
            };
            controller.ModelState.AddModelError("Token", "Token é obrigatório");

            // Act
            var result = await controller.ResetPassword(vm);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            mockUserManager.Verify(m => m.FindByEmailAsync(It.IsAny<string>()), Times.Never);
        }
    }
}
