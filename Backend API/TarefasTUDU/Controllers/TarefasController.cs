using TarefasTUDU.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;



namespace TarefasTUDU.Controllers
{

    //Define a rota base para o controller 
    [Route("api/[controller]")]
    [ApiController]
    public class TarefaController : ControllerBase 
    {
        // Variavel privada para o contexto do banco de dados
        private readonly AppDbContext _context;

        public TarefaController(AppDbContext context) 
        {
            _context = context;
        }

        //retorna todas as tarefas da base de dados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TarefaModel>>> GetTarefas()
        {
            // Retorna todas as tarefas como uma lista assíncrona
            return await _context.Tarefas.ToListAsync();
        }

        // retorna uma tarefa específica pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<TarefaModel>> GetTarefa(int id)
        {
            // busca a tarefa no banco de dados elo ID
            var tarefa = await _context.Tarefas.FindAsync(id);

            // se a tarefa não for encontrada, retona erro 404
            if (tarefa == null)
            {
                return NotFound();
                Console.WriteLine("error: 404");
                Console.WriteLine("Terafa nao encontrada.");
            }

            //retorna tarefa encontrada
            return tarefa;
        }

        // cria uma nova tarefa na base de dados
        [HttpPost]
        public async Task<ActionResult<TarefaModel>> PostTarefa(TarefaModel tarefa)
        {
            //adiciona tarefa no banco de dados
            _context.Tarefas.Add(tarefa);

            // salva no banco de dados
            await _context.SaveChangesAsync();

            // retorna um codigo 201 (Created) com a url da nova tarefa criada
            return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTarefa(int id, TarefaModel tarefa)
        {

            //Se o ID da tarefa enviada nao coincidir com o ID da URL, retorna um erro 400
            if (id != tarefa.Id)
            {
                return BadRequest();
                Console.WriteLine("error: 400");
                Console.WriteLine("Os ids nao conrrespondem");
            }


            // Marca a tarefa como modificada no banco de dados
            _context.Entry(tarefa).State = EntityState.Modified;

            try
            {
                // tenta salvar as alterações no banco de dados
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                // se o id nao for encontrado, retorna erro 404
                if (!_context.Tarefas.Any(e => e.Id == id))
                {
                    return NotFound();
                    Console.WriteLine("error: 404");
                    Console.WriteLine("Terafa nao encontrada.");

                }
                else
                {
                    // Caso ocorra algum erro de concorrência, lança uma exceção
                    throw;
                }
            }

            // Retorna um código 204 (No Content) caso a atualização tenha sido bem-sucedida
            return NoContent();
        }

        //exclui uma tarefa do banco de dados
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarefa(int id)
        {
            //busca no banco de dados pelo id
            var tarefa = await _context.Tarefas.FindAsync(id);

            // Se a tarefa não for encontrada, retorna um erro 404
            if (tarefa == null)
            {
                return NotFound();
                Console.WriteLine("error: 404");
                Console.WriteLine("Terafa nao encontrada.");

            }
            // Remove a tarefa do banco de dados
            _context.Tarefas.Remove(tarefa);

            // Salva as alterações no banco de dados
            await _context.SaveChangesAsync();

            // Retorna um código 204 (No Content) para indicar que a exclusão foi bem-sucedida
            return NoContent();
        }
    }
}

