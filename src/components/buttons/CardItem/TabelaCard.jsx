import React, { useState, useEffect } from "react";
import "./TabelaCard.css";
import CardItem from "./CardItem";
import PriorityButton from "../../buttons/PriorityButton/PriorityButton";
import LoginsInput from "../../inputs/LoginsInput";
import Desciption from "../../inputs/Description/Description";

function TabelaCard({ tarefasList, onUpdate }) {
  const [tarefas, setTarefas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState({
    id: null,
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataEntrega: "",
    StatusTarefa: "A fazer",
    Prioridade: "Não urgente",
  });

  // 🔄 USEEFFECT AJUSTADO: normaliza os campos vindos do backend (prioridade e status)
  useEffect(() => {
    if (tarefasList) {
      const normalizadas = tarefasList.map(t => ({
        ...t,
        status: t.StatusTarefa || t.statusTarefa,
        prioridade: t.Prioridade || t.prioridade,
        StatusTarefa: t.StatusTarefa || t.status,
        Prioridade: t.Prioridade || t.prioridade,
      }));
      setTarefas(normalizadas);
    }
  }, [tarefasList]);

  const openEditModal = (tarefa) => {
    setEditingTarefa({
      ...tarefa,
      StatusTarefa: tarefa.StatusTarefa || tarefa.status,
      Prioridade: tarefa.Prioridade || tarefa.prioridade,
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
      Prioridade: editingTarefa.Prioridade,
    };
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${editingTarefa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaFormatada),
      });
      if (response.ok) {
        onUpdate();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteTarefa = async (id) => {
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
            {/* ✅ AJUSTADO: usa somente `tarefa.status` pois foi normalizado no useEffect */}
            {tarefas
              .filter(tarefa => tarefa.status === status)
              .map(tarefa => (
                <CardItem 
                  key={tarefa.id} 
                  tarefa={tarefa} 
                  onClick={() => openEditModal(tarefa)}
                />
              ))}
          </div>
        ))}
      </div>

      {/* 🔧 POPUP INTERNO PARA EDIÇÃO */}
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
                PriorityText="Excluir"
                backgroundColor="red"
                FunctionPrioritybtn={() => {
                  deleteTarefa(editingTarefa.id);
                  setIsEditing(false);
                }}
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

export default TabelaCard;
