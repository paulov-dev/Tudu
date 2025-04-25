import React, { useState } from "react";
import "./TabelaCard.css";
import CardItem from "./CardItem";
import EditPopup from "../../EditPopup/EditPopup";

function TabelaCard({ tarefasList, onUpdate }) {
  const [editingTarefa, setEditingTarefa] = useState(null);

  const handleSave = async (updatedTarefa) => {
    try {
      // Mapeia os campos para o formato esperado pelo back-end
      const tarefaFormatada = {
        ...updatedTarefa,
        StatusTarefa: updatedTarefa.status, // Corrige o nome do campo
        Prioridade: updatedTarefa.prioridade,
        // Garante que as datas estão no formato correto
        DataInicio: updatedTarefa.dataInicio ? new Date(updatedTarefa.dataInicio).toISOString() : null,
        DataEntrega: updatedTarefa.dataEntrega ? new Date(updatedTarefa.dataEntrega).toISOString() : null
      };

      const response = await fetch(`https://localhost:7071/api/Tarefas/${updatedTarefa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaFormatada),
      });
      
      if (response.ok) {
        onUpdate();
        setEditingTarefa(null);
      } else {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) onUpdate();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  // Normaliza os dados recebidos da API
  const normalizedTarefas = tarefasList.map(tarefa => ({
    ...tarefa,
    status: tarefa.StatusTarefa || tarefa.statusTarefa,
    prioridade: tarefa.Prioridade || tarefa.prioridade
  }));

  return (
    <div className="kanban-container">
      <div className="kanban-board">
        {['A fazer', 'Em processo', 'Concluído'].map((status) => (
          <div key={status} className="status-column">
            <h2>{status}</h2>
            {normalizedTarefas
              .filter(tarefa => (tarefa.StatusTarefa || tarefa.status) === status)
              .map(tarefa => (
                <CardItem 
                  key={tarefa.id} 
                  tarefa={tarefa} 
                  onClick={() => setEditingTarefa(tarefa)}
                />
              ))}
          </div>
        ))}
      </div>

      {editingTarefa && (
        <EditPopup
          tarefa={editingTarefa}
          onClose={() => setEditingTarefa(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default TabelaCard;