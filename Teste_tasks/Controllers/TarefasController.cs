using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Teste_tasks.Data;
using Teste_tasks.Models;

namespace Teste_tasks.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TarefasController : ControllerBase
	{
		private readonly AppDbContext _context;

		public TarefasController(AppDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<TarefaModel>>> GetTarefas()
		{
			return await _context.TarefaModel.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<TarefaModel>> GetTarefa(int id)
		{
			var tarefa = await _context.TarefaModel.FindAsync(id);
			if (tarefa == null)
			{
				return NotFound(new { Message = "Tarefa não encontrada." });
			}
			return tarefa;
		}

		//[HttpGet("{id}")]
		//public async Task<ActionResult<TarefaModel>> GetTarefa(int id)
		//{
		//	var tarefa = await _context.TarefaModel.FindAsync(id);
		//	if (tarefa == null)
		//	{
		//		return NotFound();
		//	}
		//	return tarefa;
		//}

		[HttpPost]
		public async Task<ActionResult<TarefaModel>> PostTarefa(TarefaModel tarefa)
		{
			_context.TarefaModel.Add(tarefa);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutTarefa(int id, TarefaModel tarefa)
		{
			if (id != tarefa.Id)
			{
				return BadRequest();
			}

			_context.Entry(tarefa).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!_context.TarefaModel.Any(e => e.Id == id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTarefa(int id)
		{
			var tarefa = await _context.TarefaModel.FindAsync(id);
			if (tarefa == null)
			{
				return NotFound();
			}

			_context.TarefaModel.Remove(tarefa);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}
