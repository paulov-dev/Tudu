using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Configuration;
using Teste_tasks.Models;
//using webapplicationDataUpload.Models;
using Microsoft.AspNetCore.Identity;





namespace Teste_tasks.Data
{
	public class AppDbContext : IdentityDbContext<Users>  // <- ISSO É ESSENCIAL
	{
		public AppDbContext(DbContextOptions<AppDbContext> options)
			: base(options)
		{
		}

		// Se tiver outras entidades, declare aqui.
		 public DbSet<TarefaModel> TarefaModel { get; set; }
	
	}
}



