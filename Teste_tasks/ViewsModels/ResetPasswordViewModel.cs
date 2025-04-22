using System.ComponentModel.DataAnnotations;

namespace Teste_tasks.ViewsModels
{
	public class ResetPasswordViewModel
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		public string Token { get; set; }

		[Required(ErrorMessage = "A nova senha é obrigatória.")]
		[StringLength(100, ErrorMessage = "A nova senha deve ter no mínimo 6 caracteres.", MinimumLength = 6)]
		[DataType(DataType.Password)]
		public string NewPassword { get; set; }

		[Required(ErrorMessage = "A confirmação da nova senha é obrigatória.")]
		[DataType(DataType.Password)]
		[Compare("NewPassword", ErrorMessage = "A nova senha e a confirmação não coincidem.")]
		public string ConfirmPassword { get; set; }
	}

}
