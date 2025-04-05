// contexto de banco de dados, que será responsável por conectar a API com o banco de dados onde as tarefas serão armazenadas.

using Microsoft.EntityFrameworkCore;

namespace TarefasTUDU.Models
{   // gerencia a comunicação com DbContext
    public class AppDbContext : DbContext
    {   // Recebe as configurações do banco de dados e passa para  DbContext
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // define uma propriedade DbSet para a entidade Tarefa, que sera usada para realizar operações no banco de dados
        public DbSet<TarefaModel> Tarefas { get; set; }
    }
}
