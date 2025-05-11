using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Teste_tasks.Data;
using Teste_tasks.Models;


namespace Teste_tasks.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize] // Exige autenticação para TODOS os endpoints
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
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			return await _context.TarefaModel
				.Where(t => t.UserId == userId)
				.ToListAsync();
		}

		// GET: api/Tarefas/5
		[HttpGet("{id}")]
		public async Task<ActionResult<TarefaModel>> GetTarefa(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var tarefa = await _context.TarefaModel
				.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

			if (tarefa == null)
				return NotFound(new { Message = "Tarefa não encontrada ou acesso negado." });

			return tarefa;
		}

		// POST: api/Tarefas
		[HttpPost]
		public async Task<ActionResult<TarefaModel>> PostTarefa(TarefaModel tarefa)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			tarefa.UserId = userId;

			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			_context.TarefaModel.Add(tarefa);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
		}

		// PUT: api/Tarefas/5
		[HttpPut("{id}")]
		public async Task<IActionResult> PutTarefa(int id, TarefaModel tarefa)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var existing = await _context.TarefaModel
				.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

			if (existing == null)
				return NotFound(new { Message = "Tarefa não encontrada ou acesso negado." });

			// Atualiza campos permitidos
			existing.Titulo = tarefa.Titulo;
			existing.Descricao = tarefa.Descricao;
			existing.DataEntrega = tarefa.DataEntrega;
			existing.StatusTarefa = tarefa.StatusTarefa;
			existing.Prioridade = tarefa.Prioridade;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!_context.TarefaModel.Any(e => e.Id == id))
					return NotFound();
				throw;
			}

			return NoContent();
		}

		// PATCH: api/Tarefas/5/status
		[HttpPatch("{id}/status")]
		public async Task<IActionResult> AtualizarStatus(int id, [FromBody] AtualizarStatusRequest request)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var tarefa = await _context.TarefaModel
				.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

			if (tarefa == null)
				return NotFound(new { Message = "Tarefa não encontrada ou acesso negado." });

			// Atualiza apenas o status
			tarefa.StatusTarefa = request.Status;
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// DELETE: api/Tarefas/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTarefa(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
			var tarefa = await _context.TarefaModel
				.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

			if (tarefa == null)
				return NotFound(new { Message = "Tarefa não encontrada ou acesso negado." });

			_context.TarefaModel.Remove(tarefa);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// GET: api/Tarefas/filtrar?titulo=&dataEntrega=&status=&prioridade=
		[HttpGet("filtrar")]
		public async Task<IActionResult> Filtrar(string? titulo, DateTime? dataEntrega, string? status, string? prioridade)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			var query = _context.TarefaModel.Where(t => t.UserId == userId);

			if (!string.IsNullOrEmpty(titulo))
			{
				query = query.Where(t => t.Titulo.Contains(titulo));
			}

			if (dataEntrega.HasValue)
			{
				query = query.Where(t => t.DataEntrega == dataEntrega);
			}

			if (!string.IsNullOrEmpty(status))
			{
				query = query.Where(t => t.StatusTarefa.ToLower() == status.ToLower());
			}

			if (!string.IsNullOrEmpty(prioridade))
			{
				query = query.Where(t => t.Prioridade.ToLower() == prioridade.ToLower());
			}

			var tarefasFiltradas = await query.ToListAsync();

			return Ok(tarefasFiltradas);
		}

	}

	public class AtualizarStatusRequest
	{
		public string Status { get; set; } = string.Empty;
	}
}
