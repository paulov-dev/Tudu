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
				options.AddPolicy("AllowAll", policy =>
				{
					policy.AllowAnyOrigin()
						  .AllowAnyHeader()
						  .AllowAnyMethod();
				});
			});

			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			builder.Services.AddTransient<ICustomEmailSender, EmailSender>();
			builder.Services.Configure<AuthMessageSenderOptions>(builder.Configuration.GetSection("SendGrid"));

			// Adicione o serviço de email
			builder.Services.Configure<AuthMessageSenderOptions>(builder.Configuration.GetSection("AuthMessageSenderOptions"));
			builder.Services.AddTransient<ICustomEmailSender, EmailSender>();

			//builder.Services.AddTransient<UserDeletionService>();

			// Add services to the container.
			builder.Services.AddControllers();
			builder.Services.AddDbContext<AppDbContext>(Options =>
			Options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

			//builder.Services.AddDbContext<AppDbContext>(Options =>
			//Options.UseSqlServer(builder.Configuration.GetConnectionString("Default"), sqlServerOptions => sqlServerOptions.EnableRetryOnFailure(
			// maxRetryCount: 3,                // Número de tentativas de reconexão
			// maxRetryDelay: TimeSpan.FromSeconds(5), // Tempo máximo entre as tentativas
			// errorNumbersToAdd: null          // Erros adicionais para tratar como transitórios (opcional)
			//)));

			builder.Services.AddIdentity<Users, IdentityRole>(Options =>
			{
				Options.Password.RequireNonAlphanumeric = true;
				Options.Password.RequiredLength = 8;
				Options.Password.RequireUppercase = true;
				Options.Password.RequireLowercase = true;
				Options.User.RequireUniqueEmail = true;
				Options.SignIn.RequireConfirmedAccount = true;
				Options.SignIn.RequireConfirmedEmail = true;
				Options.SignIn.RequireConfirmedPhoneNumber = false;


			})
				.AddEntityFrameworkStores<AppDbContext>()
				.AddDefaultTokenProviders();

			var app = builder.Build();

			using (var scope = app.Services.CreateScope())
			{
				var databaseContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
				databaseContext.Database.Migrate();
			}

			// Configure the HTTP request pipeline.
			if (!app.Environment.IsDevelopment())
			{
				app.UseExceptionHandler("/Home/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();

			app.UseCors("AllowAll");




			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}



			app.UseRouting();

			app.UseAuthorization();

			app.MapControllerRoute(
				name: "default",
				pattern: "{controller=Home}/{action=Index}/{id?}");


			app.MapControllers();

			app.Run();
		}
	}
}
