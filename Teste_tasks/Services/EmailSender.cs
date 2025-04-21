using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Net.Mail;
using Teste_tasks.Services;

//public class EmailSender : ICustomEmailSender
//{
  //  private readonly string _apiKey;

    //public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
    //{
    //    _apiKey = optionsAccessor.Value.ApiKey;
    //}

   // public async Task SendEmailAsync(string email, string subject, string message)
    //{
      //  var client = new SendGridClient(_apiKey);
        //var from = new EmailAddress("gestaodesaudeindividual@outlook.com", "Gestão de Saúde Integrada");
        //var to = new EmailAddress(email);
        //var msg = MailHelper.CreateSingleEmail(from, to, subject, message, message);
        //await client.SendEmailAsync(msg);
    //}
//}

public class EmailSender : ICustomEmailSender
{
    private readonly string _apiKey;

    public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
    {
        // Aqui, estamos lendo a chave da variável de ambiente
        _apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
    }

    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var client = new SendGridClient(_apiKey);
        var from = new EmailAddress("gestaodesaudeindividual@outlook.com", "Gestão de Saúde Integrada");
        var to = new EmailAddress(email);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, message, message);
        await client.SendEmailAsync(msg);
    }
}