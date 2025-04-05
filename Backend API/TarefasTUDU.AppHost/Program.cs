var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.TarefasTUDU>("tarefastudu");

builder.Build().Run();
