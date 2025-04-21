using System.ComponentModel.DataAnnotations;

namespace Teste_tasks.ViewModels
{
	public class ChangePasswordViewModel
	{
		//[Required(ErrorMessage = "A senha atual é obrigatória.")]
		//[DataType(DataType.Password)]
		//public string CurrentPassword { get; set; }

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
