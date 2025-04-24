import React, { useState } from "react";
import "./TabelaCard.css";
import CardItem from "./CardItem";
import EditPopup from "../../EditPopup/EditPopup";

function TabelaCard({ tarefasList, onUpdate }) {
  const [editingTarefa, setEditingTarefa] = useState(null);

  const handleSave = async (updatedTarefa) => {
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${updatedTarefa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTarefa),
      });
      if (response.ok) {
        onUpdate();
        setEditingTarefa(null);
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

  return (
    <div className="kanban-container">
      <div className="kanban-board">
        {['A fazer', 'Em processo', 'Concluído'].map((status) => (
          <div key={status} className="status-column">
            <h2>{status}</h2>
            {tarefasList
              .filter(tarefa => tarefa.status === status)
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