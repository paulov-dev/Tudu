using System.Threading.Tasks;

namespace Teste_tasks.Services
{
    public interface ICustomEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }

}

