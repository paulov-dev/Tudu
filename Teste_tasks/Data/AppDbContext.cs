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

		public DbSet<TarefaModel> TarefaModel { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder); // Mantém as configurações padrão do Identity

			// Configuração do relacionamento TarefaModel -> Users
			modelBuilder.Entity<TarefaModel>()
				.HasOne(t => t.User)          // Uma tarefa pertence a um usuário
				.WithMany()                  // Um usuário pode ter muitas tarefas
				.HasForeignKey(t => t.UserId) // Chave estrangeira
				.OnDelete(DeleteBehavior.Cascade); // Opcional: define comportamento de delete
		}

	}
}


