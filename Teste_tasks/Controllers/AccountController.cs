using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Teste_tasks.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Teste_tasks.Models;
using Teste_tasks.ViewModels;



[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
	private readonly UserManager<Users> userManager;
	private readonly SignInManager<Users> signInManager;
	private readonly ICustomEmailSender emailSender;

	public AccountController(UserManager<Users> userManager, SignInManager<Users> signInManager, ICustomEmailSender emailSender)
	{
		this.userManager = userManager;
		this.signInManager = signInManager;
		this.emailSender = emailSender;
	}

	// Login endpoint
	[HttpPost("login")]
	public async Task<IActionResult> Login([FromBody] LoginViewModel model)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var user = await userManager.FindByEmailAsync(model.Email);
		if (user == null || !await userManager.IsEmailConfirmedAsync(user))
			return Unauthorized("Email ou senha inválidos.");

		var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);

		if (result.Succeeded)
			return Ok(new { Message = "Login realizado com sucesso." });
		else
			return Unauthorized("Email ou senha inválidos.");
	}

	// Register endpoint
	[HttpPost("register")]
	public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var user = new Users
		{
			FullName = model.Name,
			Email = model.Email,
			UserName = model.Email,
			DataNasc = model.DataNascimento
		};

		var result = await userManager.CreateAsync(user, model.Password);

		if (!result.Succeeded)
			return BadRequest(result.Errors);

		var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
		var confirmationLink = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, token }, Request.Scheme);

		await emailSender.SendEmailAsync(
			user.Email,
			"Confirmação de E-mail",
			$"Por favor, confirme seu e-mail clicando no link: <a href='{confirmationLink}'>Confirmar E-mail</a>"
		);

		return Ok(new { Message = "Usuário registrado com sucesso. Verifique seu e-mail para confirmação." });
	}

	// Confirm Email endpoint
	[HttpGet("confirm-email")]
	public async Task<IActionResult> ConfirmEmail(string userId, string token)
	{
		var user = await userManager.FindByIdAsync(userId);
		if (user == null)
			return NotFound("Usuário não encontrado.");

		var result = await userManager.ConfirmEmailAsync(user, token);

		if (result.Succeeded)
			return Ok(new { Message = "Email confirmado com sucesso." });
		else
			return BadRequest("Falha ao confirmar o email.");
	}

	//// Change Password endpoint
	//[HttpPost("change-password")]
	//public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
	//{
	//	if (!ModelState.IsValid)
	//		return BadRequest(ModelState);

	//	var user = await userManager.GetUserAsync(User);
	//	if (user == null)
	//		return Unauthorized("Usuário não autenticado.");

	//	var result = await userManager.ChangePasswordAsync(user, model.NewPassword);
	//	if (result.Succeeded)
	//		return Ok(new { Message = "Senha alterada com sucesso." });

	//	return BadRequest(result.Errors);
	//}

	[HttpPost("change-password")]
	public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var user = await userManager.GetUserAsync(User);
		if (user == null)
			return Unauthorized("Usuário não autenticado.");

		// 1) gera um token
		var token = await userManager.GeneratePasswordResetTokenAsync(user);

		// 2) reseta a senha usando o token
		var result = await userManager.ResetPasswordAsync(user, token, model.NewPassword);

		if (result.Succeeded)
			return Ok(new { Message = "Senha alterada com sucesso." });

		return BadRequest(result.Errors);
	}



	//	[HttpPost]
	//	public async Task<IActionResult> DeleteAllUsers()
	//	{
	//		await _userDeletionService.DeleteAllUsersAsync();
	//		return Ok("Todos os usuários foram deletados com sucesso.");
	//	}
}

