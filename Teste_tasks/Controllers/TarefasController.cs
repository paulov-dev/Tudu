using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Teste_tasks.Data;
using Teste_tasks.Models;

namespace Teste_tasks.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	[Authorize] // Exige autenticação para TODOS os endpoints do controller
	public class TarefasController : ControllerBase
	{
		private readonly AppDbContext _context;

		public TarefasController(AppDbContext context)
		{
			_context = context;
		}

		// GET: api/Tarefas
		[HttpGet]
		public async Task<ActionResult<IEnumerable<TarefaModel>>> GetTarefas()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // ID do usuário logado
			return await _context.TarefaModel
				.Where(t => t.UserId == userId) // Filtra apenas tarefas do usuário
				.ToListAsync();
		}

		// GET: api/Tarefas/5
		[HttpGet("{id}")]
		public async Task<ActionResult<TarefaModel>> GetTarefa(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var tarefa = await _context.TarefaModel
				.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId); // Verifica dono da tarefa

			if (tarefa == null)
			{
				return NotFound(new { Message = "Tarefa não encontrada ou acesso negado." });
			}

			return tarefa;
		}

		// POST: api/Tarefas
		//[HttpPost]
		//public async Task<ActionResult<TarefaModel>> PostTarefa(TarefaModel tarefa)
		//{
		//	var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
		//	tarefa.UserId = userId; // Associa automaticamente ao usuário logado

		//	_context.TarefaModel.Add(tarefa);
		//	await _context.SaveChangesAsync();

		//	return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
		//}

		[HttpPost]
		public async Task<ActionResult<TarefaModel>> PostTarefa(TarefaModel tarefa)
		{
			//  Atribua o UserId ANTES da validação:
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			tarefa.UserId = userId;

			if (!ModelState.IsValid) //  UserId definido
			{
				return BadRequest(ModelState);
			}

			_context.TarefaModel.Add(tarefa);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
		}

		// PUT: api/Tarefas/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutTarefa(int id, TarefaModel tarefa)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			// Verifica se a tarefa pertence ao usuário
			var existingTarefa = await _context.TarefaModel
				.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

			if (existingTarefa == null)
			{
				return NotFound(new { Message = "Tarefa não encontrada ou acesso negado." });
			}

			// Atualiza apenas campos permitidos
			existingTarefa.Titulo = tarefa.Titulo;
			existingTarefa.Descricao = tarefa.Descricao;
			existingTarefa.DataEntrega = tarefa.DataEntrega;
			existingTarefa.StatusTarefa = tarefa.StatusTarefa;
			existingTarefa.Prioridade = tarefa.Prioridade;

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

		// DELETE: api/Tarefas/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTarefa(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var tarefa = await _context.TarefaModel
				.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId); // Verifica dono

			if (tarefa == null)
			{
				return NotFound(new { Message = "Tarefa não encontrada ou acesso negado." });
			}

			_context.TarefaModel.Remove(tarefa);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// GET: api/Tarefas/filtrar?titulo=Texto
		[HttpGet("filtrar")]
		public async Task<ActionResult<IEnumerable<TarefaModel>>> FiltrarPorTitulo([FromQuery] string? titulo)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			var query = _context.TarefaModel
				.Where(t => t.UserId == userId);

			if (!string.IsNullOrEmpty(titulo))
			{
				query = query.Where(t => t.Titulo.Contains(titulo, StringComparison.OrdinalIgnoreCase));
			}

			return await query.ToListAsync();
		}
	}
}
	
