using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Teste_tasks.Data;
using Teste_tasks.Models;
using Teste_tasks.Services;

namespace Teste_tasks
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// 1) CORS (sua origem React)
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowFrontend", policy =>
				{
					policy.WithOrigins(
							"http://localhost:5173",
							"http://localhost:5174"   // ← adiciona esta linha
						)
						.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowCredentials();
				});
			});


			// 2) DbContext
			builder.Services.AddDbContext<AppDbContext>(options =>
				options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

			// 3) Identity + EF stores + Token Providers
			builder.Services.AddIdentity<Users, IdentityRole>(options =>
			{
				// Suas regras de senha e confirmação
				options.Password.RequireNonAlphanumeric = true;
				options.Password.RequiredLength = 8;
				options.Password.RequireUppercase = true;
				options.Password.RequireLowercase = true;
				options.User.RequireUniqueEmail = true;
				options.SignIn.RequireConfirmedAccount = true;
				options.SignIn.RequireConfirmedEmail = true;
				options.SignIn.RequireConfirmedPhoneNumber = false;
			})
			.AddEntityFrameworkStores<AppDbContext>()
			.AddDefaultTokenProviders();

			// 4) Configuração de Cookie e interceptação do RedirectToLogin
			builder.Services.ConfigureApplicationCookie(options =>
			{
				// Permite envio em HTTP local e em fetch cross-site
				options.Cookie.SameSite = SameSiteMode.None;
				options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

				options.Events.OnRedirectToLogin = context =>
				{
					// Se for chamada à API, devolve 401 em vez de redirect
					if (context.Request.Path.StartsWithSegments("/api"))
					{
						context.Response.StatusCode = StatusCodes.Status401Unauthorized;
						return Task.CompletedTask;
					}
					// Senão, redireciona normalmente
					context.Response.Redirect(context.RedirectUri);
					return Task.CompletedTask;
				};
			});

			// 5) Serviços de e-mail (SendGrid / SMTP)
			builder.Services.Configure<AuthMessageSenderOptions>(
				builder.Configuration.GetSection("AuthMessageSenderOptions"));
			builder.Services.AddTransient<ICustomEmailSender, EmailSender>();

			// 6) Controllers e Swagger
			builder.Services.AddControllers();
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			var app = builder.Build();

			// Aplica migrações
			using (var scope = app.Services.CreateScope())
			{
				var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
				db.Database.Migrate();
			}

			// Pipeline HTTP
			if (!app.Environment.IsDevelopment())
			{
				app.UseExceptionHandler("/Home/Error");
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();

			app.UseRouting();

			app.UseCors("AllowFrontend");

			app.UseAuthentication();
			app.UseAuthorization();

			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			// Rotas
			app.MapControllerRoute(
				name: "default",
				pattern: "{controller=Home}/{action=Index}/{id?}");
			app.MapControllers();

			app.Run();
		}
	}
}