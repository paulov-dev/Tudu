// TabelaItens.jsx (integrado e mantendo edição completa)
import React, { useEffect, useState } from "react";
import "./TabelaItens.css";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import LoginsInput from "../inputs/LoginsInput";
import Description from "../inputs/Description/Description";
import InputDate from "../inputs/InputDate/InputDate";

export default function TabelaItens({ tarefasList, onUpdate }) {
  const [tarefas, setTarefas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState(null);

  useEffect(() => {
    if (tarefasList) {
      setTarefas(
        tarefasList.map((t) => ({
          ...t,
          statusTarefa: t.statusTarefa || t.StatusTarefa,
          prioridade: t.prioridade || t.Prioridade
        }))
      );
    }
  }, [tarefasList]);

  const deleteTarefa = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7071/api/Tarefas/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) onUpdate();
      else {
        const err = await response.text();
        alert(`Erro ${response.status}: ${err}`);
      }
    } catch (error) {
      alert("Falha na conexão ao excluir tarefa.");
    }
  };

  const openEditModal = (tarefa) => {
    setEditingTarefa({
      id: tarefa.id,
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      dataInicio: tarefa.dataInicio?.slice(0,16),
      dataEntrega: tarefa.dataEntrega?.slice(0,16),
      statusTarefa: tarefa.statusTarefa,
      prioridade: tarefa.prioridade
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTarefa((prev) => ({ ...prev, [name]: value }));
  };

  const updateTarefa = async () => {
    const body = {
      ...editingTarefa,
      dataInicio: editingTarefa.dataInicio ? new Date(editingTarefa.dataInicio).toISOString() : null,
      dataEntrega: editingTarefa.dataEntrega ? new Date(editingTarefa.dataEntrega).toISOString() : null
    };
    try {
      const response = await fetch(
        `https://localhost:7071/api/Tarefas/${editingTarefa.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body)
        }
      );
      if (response.ok) {
        onUpdate();
        setIsEditing(false);
      } else {
        const err = await response.text();
        alert(`Erro ${response.status}: ${err}`);
      }
    } catch (error) {
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
              <td>{item.statusTarefa}</td>
              <td>{item.prioridade}</td>
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

      {isEditing && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Editar Tarefa</h3>
            <LoginsInput
              textoInput="Título"
              name="titulo"
              value={editingTarefa.titulo}
              onChange={handleEditChange}
            />
            <Description
              description="Descrição"
              name="descricao"
              value={editingTarefa.descricao}
              onChange={handleEditChange}
            />
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
                  name="statusTarefa"
                  value={editingTarefa.statusTarefa}
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
                  name="prioridade"
                  value={editingTarefa.prioridade}
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
