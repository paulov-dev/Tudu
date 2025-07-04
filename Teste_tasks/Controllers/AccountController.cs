﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Teste_tasks.Services;
using Microsoft.AspNetCore.Identity.UI.Services;
using Teste_tasks.Models;
using Teste_tasks.ViewModels;
using Teste_tasks.ViewsModels;
using Microsoft.AspNetCore.Authorization;



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

	[HttpPost("logout")]
	[Authorize] 
	public async Task<IActionResult> Logout()
	{
		await signInManager.SignOutAsync();
		_logger.LogInformation("Usuário não está mais conectado.");
		return Ok(new { Message = "Logout realizado com sucesso." });
	}

}




//	[HttpPost]
//	public async Task<IActionResult> DeleteAllUsers()
//	{
//		await _userDeletionService.DeleteAllUsersAsync();
//		return Ok("Todos os usuários foram deletados com sucesso.");
//	}


