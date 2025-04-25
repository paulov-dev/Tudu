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

			
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowFrontend", policy =>
				{
					policy
			// Aceita qualquer local host
			.SetIsOriginAllowed(origin =>
			{
				var uri = new Uri(origin);
				return uri.Host == "localhost";
			})
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

			// NÃO ALTERAR Configuração de Cookie e interceptação do RedirectToLogin
			builder.Services.ConfigureApplicationCookie(options =>
			{
				// NÃO ALTERAR: Permite envio em HTTP local e em fetch cross-site
				options.Cookie.SameSite = SameSiteMode.None;
				options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

				options.Events.OnRedirectToLogin = context =>
				{
					
					if (context.Request.Path.StartsWithSegments("/api"))
					{
						context.Response.StatusCode = StatusCodes.Status401Unauthorized;
						return Task.CompletedTask;
					}
				
					context.Response.Redirect(context.RedirectUri);
					return Task.CompletedTask;
				};
			});

			
			builder.Services.Configure<AuthMessageSenderOptions>(
				builder.Configuration.GetSection("AuthMessageSenderOptions"));
			builder.Services.AddTransient<ICustomEmailSender, EmailSender>();

			
			builder.Services.AddControllers();
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			var app = builder.Build();

			
			using (var scope = app.Services.CreateScope())
			{
				var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
				db.Database.Migrate();
			}

		
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

			
			app.MapControllerRoute(
				name: "default",
				pattern: "{controller=Home}/{action=Index}/{id?}");
			app.MapControllers();

			app.Run();
		}
	}
}