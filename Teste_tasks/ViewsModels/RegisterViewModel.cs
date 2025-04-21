using System;
using System.ComponentModel.DataAnnotations;

namespace Teste_tasks.ViewModels
{
	public class RegisterViewModel
	{
		[Required(ErrorMessage = "O nome é obrigatório.")]
		public string Name { get; set; }

		[Required(ErrorMessage = "O email é obrigatório.")]
		[EmailAddress(ErrorMessage = "Email inválido.")]
		public string Email { get; set; }

		[Required(ErrorMessage = "A senha é obrigatória.")]
		[StringLength(100, ErrorMessage = "A senha deve ter no mínimo 6 caracteres.", MinimumLength = 6)]
		public string Password { get; set; }

		[Required(ErrorMessage = "A data de nascimento é obrigatória.")]
		public DateTime DataNascimento { get; set; }
	}
}
