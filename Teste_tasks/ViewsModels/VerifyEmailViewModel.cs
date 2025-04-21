using System.ComponentModel.DataAnnotations;

namespace Teste_tasks.ViewModels
{
	public class VerifyEmailViewModel
	{
		[Required(ErrorMessage = "O ID do usuário é obrigatório.")]
		public string UserId { get; set; }

		[Required(ErrorMessage = "O token de verificação é obrigatório.")]
		public string Token { get; set; }
	}
}

