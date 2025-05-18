using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Teste_tasks.Controllers;
using Teste_tasks.Models;
using Teste_tasks.Services;
using Xunit;

namespace Tudu.Tests.Account
{
    public class LogoutTest
    {
        [Fact(DisplayName = "SignOut e retorna Ok")]
        public async Task Logout_Success_ReturnsOk()
        {
            // ------------ Arrange ------------
            var mockUserStore = new Mock<IUserStore<Users>>();
            var mockUserManager = new Mock<UserManager<Users>>(mockUserStore.Object,
                                                               null, null, null, null, null, null, null, null);

            var mockSignInManager = new Mock<SignInManager<Users>>(
                mockUserManager.Object,
                new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>().Object,
                new Mock<IUserClaimsPrincipalFactory<Users>>().Object,
                null, null, null, null);

            mockSignInManager.Setup(s => s.SignOutAsync())
                             .Returns(Task.CompletedTask)
                             .Verifiable();

            var mockEmailSender = new Mock<ICustomEmailSender>();
            var mockLogger = new Mock<ILogger<AccountController>>();

            var controller = new AccountController(mockUserManager.Object,
                                                   mockSignInManager.Object,
                                                   mockEmailSender.Object,
                                                   mockLogger.Object);

            // ------------- Act ---------------
            var result = await controller.Logout();

            // ------------ Assert -------------
            var ok = Assert.IsType<OkObjectResult>(result);

            var msg = ok.Value?.GetType()
                               .GetProperty("Message")!
                               .GetValue(ok.Value)?
                               .ToString();

            Assert.Contains("Logout realizado com sucesso", msg);

            mockSignInManager.Verify(s => s.SignOutAsync(), Times.Once);
        }
    }
}
