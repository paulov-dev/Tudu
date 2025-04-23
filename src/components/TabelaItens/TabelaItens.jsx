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
    status: "A fazer",         // ADICIONADO: estado inicial status
    prioridade: "Não urgente", // ADICIONADO: estado inicial prioridade
  });

  // Atualiza o estado local quando as props mudam
  useEffect(() => {
    if (tarefasList && Array.isArray(tarefasList)) {
      setTarefas(tarefasList);
    }
  }, [tarefasList]);

  const deleteTarefa = async (id) => {
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTarefas(tarefas.filter((t) => t.id !== id));
        if (onUpdate) onUpdate();
      } else {
        console.error("Erro ao deletar tarefa: ", response.status);
      }
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const openEditModal = (id) => {
    const tarefa = tarefas.find((t) => t.id === id);
    if (tarefa) {
      setEditingTarefa(tarefa);
      setIsEditing(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTarefa({
      ...editingTarefa,
      [name]: value // já genérico: agora abrange status/prioridade
    });
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toISOString();
  };

  const updateTarefa = async () => {
    const tarefaFormatada = {
      ...editingTarefa,
      dataInicio: formatarData(editingTarefa.dataInicio),
      dataEntrega: formatarData(editingTarefa.dataEntrega)
      // status e prioridade já no objeto
    };
    try {
      const response = await fetch(
        `https://localhost:7071/api/Tarefas/${editingTarefa.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tarefaFormatada) // inclui status/prioridade
        }
      );
      if (response.ok) {
        setTarefas(
          tarefas.map((t) =>
            t.id === editingTarefa.id ? editingTarefa : t
          )
        );
        setIsEditing(false);
        alert("Tarefa atualizada com sucesso!");
        if (onUpdate) onUpdate();
      } else {
        console.error("Erro ao atualizar tarefa");
      }
    } catch (error) {
      console.error("Erro na requisição de atualização:", error);
    }
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditingTarefa({
      id: null,
      titulo: "",
      descricao: "",
      dataEntrega: "",
      dataInicio: "",
      status: "A fazer",          // RESET: volta ao padrão
      prioridade: "Não urgente"    // RESET: volta ao padrão
    });
  };

  const formatarDataExibicao = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString();
  };

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            {/* <th>Data de início</th>*/}
            <th>Data de entrega</th>
            <th>Título</th>
            <th>Status</th>       {/* ADICIONADO: coluna status */}
            <th>Prioridade</th>   {/* ADICIONADO: coluna prioridade */}
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map((item) => (
            <tr key={item.id}>
              {/* <td>{formatarDataExibicao(item.dataInicio)}</td>*/}
              <td>{formatarDataExibicao(item.dataEntrega)}</td>
              <td>{item.titulo}</td>
              <td>{item.status}</td>       {/* exibe status */}
              <td>{item.prioridade}</td>   {/* exibe prioridade */}
              <td className="actions">
                <PriorityButton
                  PriorityText="Editar"
                  backgroundColor="var(--blue)"
                  FunctionPrioritybtn={() => openEditModal(item.id)}
                />
                <PriorityButton
                  PriorityText="Deletar"
                  backgroundColor="red"
                  FunctionPrioritybtn={() => deleteTarefa(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Edição */}
      {isEditing && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Editar Tarefa</h3>

            {/* título */}
            <div className="form-row">
              <LoginsInput
                textoInput="Editar título da tarefa"
                name="titulo"
                value={editingTarefa.titulo}
                onChange={handleEditChange}
              />
            </div>

            {/* descrição */}
            <div className="form-row">
              <Desciption
                description="Editar descrição"
                name="descricao"
                value={editingTarefa.descricao}
                onChange={handleEditChange}
              />
            </div>

            {/* duas colunas datas */}
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

            {/* duas colunas selects */}
            <div className="form-row two-cols">
              <div className="field">
                <label>Status</label>
                <select
                  name="status"
                  value={editingTarefa.status}
                  onChange={handleEditChange}
                >
                  <option>A fazer</option>
                  <option>Em processo</option>
                  <option>Concluido</option>
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

            {/* botões */}
            <div className="form-row buttons-row">
              <PriorityButton
                PriorityText="Cancelar"
                backgroundColor="var(--Borda)"
                FunctionPrioritybtn={closeEditModal}
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
