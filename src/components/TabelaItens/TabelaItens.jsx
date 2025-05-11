import React, { useEffect, useState } from "react";
import "./TabelaItens.css";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import LoginsInput from "../inputs/LoginsInput";
import Desciption from "../inputs/Description/Description";
import InputDate from "../inputs/InputDate/InputDate";

function TabelaItens({ tarefasList, onUpdate }) {
  const [tarefas, setTarefas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState({
    id: null,
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataEntrega: "",
    StatusTarefa: "A fazer",
    Prioridade: "Não urgente"
  });

  useEffect(() => {
    if (tarefasList) {
      setTarefas(
        tarefasList.map((t) => ({
          ...t,
          StatusTarefa: t.StatusTarefa || t.status,
          Prioridade: t.Prioridade || t.prioridade
        }))
      );
    }
  }, [tarefasList]);

  const deleteTarefa = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7071/api/Tarefas/${id}`,
        {
          method: "DELETE",
          credentials: "include" // ← envia cookie
        }
      );
      if (response.ok) {
        onUpdate();
      } else {
        const err = await response.text();
        console.error("Erro ao excluir tarefa:", err);
        alert(`Erro ${response.status}: ${err}`);
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Falha na conexão ao excluir tarefa.");
    }
  };

  const openEditModal = (tarefa) => {
    setEditingTarefa({
      ...tarefa,
      StatusTarefa: tarefa.StatusTarefa || tarefa.status,
      Prioridade: tarefa.Prioridade || tarefa.prioridade
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTarefa((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const updateTarefa = async () => {
    const tarefaFormatada = {
      ...editingTarefa,
      dataInicio: editingTarefa.dataInicio
        ? new Date(editingTarefa.dataInicio).toISOString()
        : null,
      dataEntrega: editingTarefa.dataEntrega
        ? new Date(editingTarefa.dataEntrega).toISOString()
        : null,
      StatusTarefa: editingTarefa.StatusTarefa,
      Prioridade: editingTarefa.Prioridade
    };

    try {
      const response = await fetch(
        `https://localhost:7071/api/Tarefas/${editingTarefa.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ← envia cookie
          body: JSON.stringify(tarefaFormatada)
        }
      );

      if (response.ok) {
        onUpdate();
        setIsEditing(false);
      } else {
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
                    day:   '2-digit',
                    month: '2-digit',
                    year:  'numeric',
                    hour:   '2-digit',
                    minute: '2-digit'
                  })
                  
                  : ""}
              </td>              
              <td>{item.StatusTarefa}</td>
              <td>{item.Prioridade}</td>


              <td className="actions">
                <PriorityButton
                  PriorityText=""
                  backgroundColor="#17abff"
                  FunctionPrioritybtn={() => openEditModal(item)}
                  icone="fa-solid fa-pencil"
                />
                <PriorityButton
                  PriorityText=""
                  backgroundColor="#ff0101"
                  FunctionPrioritybtn={() => deleteTarefa(item.id)}
                  icone="fa-solid fa-trash-can"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Editar Tarefa</h3>
            <div className="form-row">
              <LoginsInput
                textoInput="Título"
                name="titulo"
                value={editingTarefa.titulo}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-row">
              <Desciption
                description="Descrição"
                name="descricao"
                value={editingTarefa.descricao}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-row two-cols">
              <div className="field">
                <label>Data de início</label>
                <InputDate
                  name="dataInicio"
                  value={editingTarefa.dataInicio}
                  onChange={handleEditChange}
                />
              </div>
              <div className="field">
                <label>Data de entrega</label>
                <InputDate
                  name="dataEntrega"
                  value={editingTarefa.dataEntrega}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            <div className="form-row two-cols">
              <div className="field">
                <label>Status</label>
                <select
                  name="StatusTarefa"
                  value={editingTarefa.StatusTarefa}
                  onChange={handleEditChange}
                >
                  <option>A fazer</option>
                  <option>Em processo</option>
                  <option>Concluído</option>
                </select>
              </div>
              <div className="field">
                <label>Prioridade</label>
                <select
                  name="Prioridade"
                  value={editingTarefa.Prioridade}
                  onChange={handleEditChange}
                >
                  <option>Muito urgente</option>
                  <option>Pouco urgente</option>
                  <option>Não urgente</option>
                </select>
              </div>
            </div>
            <div className="buttons-row">
              <PriorityButton
                PriorityText="Cancelar"
                backgroundColor="var(--Borda)"
                FunctionPrioritybtn={() => setIsEditing(false)}
              />
              <PriorityButton
                PriorityText="Salvar"
                backgroundColor="var(--blue)"
                FunctionPrioritybtn={updateTarefa}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TabelaItens;
