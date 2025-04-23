using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Teste_tasks.Services;
using System.Net;

public class EmailSender : ICustomEmailSender
{
	private readonly string _apiKey;
	private readonly ILogger<EmailSender> _logger;

	public EmailSender(IConfiguration config, ILogger<EmailSender> logger)
	{
		_apiKey = config["SendGrid:ApiKey"]
			?? throw new ArgumentNullException("SendGrid:ApiKey não foi encontrada em IConfiguration");
		_logger = logger;
	}

	public async Task SendEmailAsync(string email, string subject, string htmlMessage)
	{
		_logger.LogInformation("SendGrid: usando ApiKey = {ApiKeyPrefix}…",
			_apiKey.Length > 8 ? _apiKey.Substring(0, 8) : _apiKey);

		var client = new SendGridClient(_apiKey);
		var from = new EmailAddress("gestaodesaudeindividual@outlook.com", "Tudu");
		var to = new EmailAddress(email);
		var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent: null, htmlContent: htmlMessage);
		var response = await client.SendEmailAsync(msg);

		_logger.LogInformation("SendGrid retornou {StatusCode}", response.StatusCode);
		if (response.StatusCode is not (HttpStatusCode.Accepted or HttpStatusCode.OK))
		{
			var body = await response.Body.ReadAsStringAsync();
			_logger.LogError("SendGrid falhou: {Body}", body);
			throw new Exception($"SendGrid error: {response.StatusCode}");
		}
	}

}




//public class EmailSender : ICustomEmailSender
//{
//    private readonly string _apiKey;

//    public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
//    {
//        _apiKey = optionsAccessor.Value.ApiKey;
//    }

//    public async Task SendEmailAsync(string email, string subject, string message)
//    {
//        var client = new SendGridClient(_apiKey);
//        var from = new EmailAddress("gestaodesaudeindividual@outlook.com", "Gestão de Saúde Integrada");
//        var to = new EmailAddress(email);
//        var msg = MailHelper.CreateSingleEmail(from, to, subject, message, message);
//        await client.SendEmailAsync(msg);
//    }
//}

//public class EmailSender : ICustomEmailSender
//{
//    private readonly string _apiKey;

//    public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
//    {
//        // Aqui, estamos lendo a chave da variável de ambiente
//        _apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
//    }

//    public async Task SendEmailAsync(string email, string subject, string message)
//    {
//        var client = new SendGridClient(_apiKey);
//        var from = new EmailAddress("gestaodesaudeindividual@outlook.com", "Gestão de Saúde Integrada");
//        var to = new EmailAddress(email);
//        var msg = MailHelper.CreateSingleEmail(from, to, subject, message, message);
//        await client.SendEmailAsync(msg);
//    }
//}