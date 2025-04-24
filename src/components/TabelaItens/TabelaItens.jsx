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
      setTarefas(tarefasList.map(t => ({
        ...t,
        status: t.StatusTarefa || t.status,
        prioridade: t.Prioridade || t.prioridade,
        StatusTarefa: t.StatusTarefa,
        Prioridade: t.Prioridade
      })));
    }
  }, [tarefasList]);

  const deleteTarefa = async (id) => {
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
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
    setEditingTarefa({
      ...editingTarefa,
      [name]: value
    });
  };

  const updateTarefa = async () => {
    const tarefaFormatada = {
      ...editingTarefa,
      dataInicio: editingTarefa.dataInicio ? new Date(editingTarefa.dataInicio).toISOString() : null,
      dataEntrega: editingTarefa.dataEntrega ? new Date(editingTarefa.dataEntrega).toISOString() : null,
      StatusTarefa: editingTarefa.StatusTarefa,
      Prioridade: editingTarefa.Prioridade
    };
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${editingTarefa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaFormatada)
      });
      
      if (response.ok) {
        onUpdate();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Data de início</th>
            <th>Data de entrega</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map((item) => (
            <tr key={item.id}>
              <td>{item.titulo}</td>
              <td>{item.StatusTarefa || item.statusTarefa}</td>
              <td>{item.Prioridade || item.prioridade}</td>
              <td>{item.dataInicio ? new Date(item.dataInicio).toLocaleDateString() : ''}</td>
              <td>{item.dataEntrega ? new Date(item.dataEntrega).toLocaleDateString() : ''}</td>
              <td className="actions">
                <PriorityButton
                  PriorityText="Editar"
                  backgroundColor="var(--blue)"
                  FunctionPrioritybtn={() => openEditModal(item)}
                />
                <PriorityButton
                  PriorityText="Excluir"
                  backgroundColor="red"
                  FunctionPrioritybtn={() => deleteTarefa(item.id)}
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
                <input
                  type="date"
                  name="dataInicio"
                  value={editingTarefa.dataInicio}
                  onChange={handleEditChange}
                />
              </div>
              <div className="field">
                <label>Data de entrega</label>
                <input
                  type="date"
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
