using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Teste_tasks.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Teste_tasks.Models;
using Teste_tasks.ViewModels;
using Teste_tasks.ViewsModels;



[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
	private readonly UserManager<Users> userManager;
	private readonly SignInManager<Users> signInManager;
	private readonly ICustomEmailSender emailSender;
	private readonly ILogger<AccountController> _logger;

	public AccountController(UserManager<Users> userManager, SignInManager<Users> signInManager, ICustomEmailSender emailSender, ILogger<AccountController> logger)
	{
		this.userManager = userManager;
		this.signInManager = signInManager;
		this.emailSender = emailSender;
		this._logger = logger;
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

	//	var result = await userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
	//	if (result.Succeeded)
	//		return Ok(new { Message = "Senha alterada com sucesso." });

	//	return BadRequest(result.Errors);
	//}

	//[HttpPost("change-password")]
	//public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
	//{
	//	if (!ModelState.IsValid)
	//		return BadRequest(ModelState);

	//	var user = await userManager.GetUserAsync(User);
	//	if (user == null)
	//		return Unauthorized("Usuário não autenticado.");

	//	// 1) gera um token
	//	var token = await userManager.GeneratePasswordResetTokenAsync(user);

	//	// 2) reseta a senha usando o token
	//	var result = await userManager.ResetPasswordAsync(user, token, model.NewPassword);

	//	if (result.Succeeded)
	//		return Ok(new { Message = "Senha alterada com sucesso." });

	//	return BadRequest(result.Errors);
	//}

	// 1) Esqueci minha senha
	// 1) solicita reset via e‑mail
	//[HttpPost("forgot-password")]
	//public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
	//{
	//	if (!ModelState.IsValid)
	//		return BadRequest(ModelState);

	//	var user = await userManager.FindByEmailAsync(model.Email);
	//	if (user == null /*|| !await _userManager.IsEmailConfirmedAsync(user)*/)
	//	{
	//		// retorna 200 pra não expor existência de conta
	//		_logger.LogWarning("ForgotPassword: usuário não encontrado ou não confirmado: {Email}", model.Email);
	//		return Ok();
	//	}

	//	var token = await userManager.GeneratePasswordResetTokenAsync(user);
	//	var resetLink = Url.Action(
	//		nameof(ResetPassword),
	//		"Account",
	//		new { token, email = model.Email },
	//		Request.Scheme);

	//	_logger.LogInformation("Reset link gerado: {Link}", resetLink);

	//	await emailSender.SendEmailAsync(
	//		user.Email,
	//		"Redefinição de senha",
	//		$"Clique aqui para redefinir sua senha: {resetLink}");

	//	return Ok(new { Message = "Instruções para redefinir a senha foram enviadas por e-mail." });
	//}

	//// 2) redefine efetivamente a senha
	//[HttpPost("reset-password")]
	//public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
	//{
	//	if (!ModelState.IsValid)
	//		return BadRequest(ModelState);

	//	var user = await userManager.FindByEmailAsync(model.Email);
	//	if (user == null)
	//		return BadRequest("Usuário não encontrado.");

	//	var result = await userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
	//	if (result.Succeeded)
	//		return Ok(new { Message = "Senha redefinida com sucesso." });

	//	return BadRequest(result.Errors);
	//}

	//[HttpGet("reset-password")]
	//public IActionResult ResetPassword(string token, string email)
	//{

	//	var frontendBase = "http://localhost:5173/RedefinirSenha";
	//	var url = $"{frontendBase}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";
	//	return Redirect(url);
	//}

	[HttpPost("forgot-password")]
	public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var user = await userManager.FindByEmailAsync(model.Email);
		if (user == null /*|| !await _userManager.IsEmailConfirmedAsync(user)*/)
		{
			// retorna 200 pra não expor existência de conta
			_logger.LogWarning("ForgotPassword: usuário não encontrado ou não confirmado: {Email}", model.Email);
			return Ok();
		}

		var token = await userManager.GeneratePasswordResetTokenAsync(user);

		// 🔧 Gera link para a página do front-end (React)
		var resetLink = $"http://localhost:5174/RedefinirSenha?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(model.Email)}";

		_logger.LogInformation("Reset link gerado: {Link}", resetLink);

		await emailSender.SendEmailAsync(
			user.Email,
			"Redefinição de senha",
			$"Clique aqui para redefinir sua senha: <a href=\"{resetLink}\">Redefinir Senha</a>");

		return Ok(new { Message = "Instruções para redefinir a senha foram enviadas por e-mail." });
	}


	[HttpPost("reset-password")]
	public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var user = await userManager.FindByEmailAsync(model.Email);
		if (user == null)
			return BadRequest("Usuário não encontrado.");

		var result = await userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
		if (result.Succeeded)
			return Ok(new { Message = "Senha redefinida com sucesso." });

		return BadRequest(result.Errors);
	}


}




//	[HttpPost]
//	public async Task<IActionResult> DeleteAllUsers()
//	{
//		await _userDeletionService.DeleteAllUsersAsync();
//		return Ok("Todos os usuários foram deletados com sucesso.");
//	}


