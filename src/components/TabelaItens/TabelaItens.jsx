// TabelaItens.jsx (atualizado)
import React, { useState } from "react";
import "./TabelaItens.css";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";

export default function TabelaItens({ tarefasList, onUpdate }) {
  const tarefas = tarefasList || [];

  const deleteTarefa = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7071/api/Tarefas/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) onUpdate();
      else {
        const err = await response.text();
        console.error("Erro ao excluir tarefa:", err);
        alert(`Erro ${response.status}: ${err}`);
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Falha na conexão ao excluir tarefa.");
    }
  };

  const [editingTarefa, setEditingTarefa] = useState(null);

  const openEditModal = (tarefa) => setEditingTarefa(tarefa);

  const closeModal = () => setEditingTarefa(null);

  const updateTarefa = async (updated) => {
    try {
      const response = await fetch(
        `https://localhost:7071/api/Tarefas/${updated.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updated),
        }
      );
      if (response.ok) { onUpdate(); closeModal(); }
      else {
        const err = await response.text();
        console.error("Erro ao atualizar tarefa:", err);
        alert(`Erro ${response.status}: ${err}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Falha na conexão ao atualizar tarefa.");
    }
  };

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>Data de entrega</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map((item) => (
            <tr key={item.id}>
              <td>{item.titulo}</td>
              <td>
                {item.dataEntrega
                  ? new Date(item.dataEntrega).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })
                  : ''}
              </td>
              <td>{item.statusTarefa || item.StatusTarefa}</td>
              <td>{item.prioridade || item.Prioridade}</td>
              <td className="actions">
                <PriorityButton
                  backgroundColor="#17abff"
                  FunctionPrioritybtn={() => openEditModal(item)}
                  icone="fa-solid fa-pencil"
                />
                <PriorityButton
                  backgroundColor="#ff0101"
                  FunctionPrioritybtn={() => deleteTarefa(item.id)}
                  icone="fa-solid fa-trash-can"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTarefa && (
        <EditModal
          tarefa={editingTarefa}
          onSave={updateTarefa}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

// Note: Create a separate EditModal component handling form inputs and calling onSave(updatedTarefa).
