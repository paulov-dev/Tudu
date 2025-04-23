namespace Teste_tasks.Models
{
	public class TarefaModel
	{

		public int Id { get; set; }
		public string? Titulo { get; set; }
		public string? Descricao { get; set; }
		public DateTime DataEntrega { get; set; }

		public DateTime DataInicio { get; set; }

		public string StatusTarefa { get; set; }

		public string Prioridade { get; set; }

	}
}
