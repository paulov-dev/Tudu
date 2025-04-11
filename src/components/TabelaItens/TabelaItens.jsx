import React, { useEffect, useState } from "react";
import "./TabelaItens.css";
import AddEventButton from "../buttons/AddEventButton/AddEventButton";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import LoginsInput from "../inputs/LoginsInput";
import Desciption from "../inputs/Description/Description";
import InputDate from "../inputs/InputDate/InputDate";
function TabelaItens() {
  const [tarefas, setTarefas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState({
    id: null,
    titulo: '',
    descricao: '',
    dataEntrega: ''
  });

  // Função para buscar as tarefas da API
  const fetchTarefas = async () => {
    try {
      const response = await fetch('https://localhost:7071/api/Tarefas');
      if (response.ok) {
        const data = await response.json();
        setTarefas(data);
      } else {
        console.error("Erro ao buscar tarefas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Função para deletar uma tarefa
  const deleteTarefa = async (id) => {
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
      } else {
        console.error("Erro ao deletar tarefa: ", response.status);
      }
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  // Função para abrir o modal de edição
  const openEditModal = (id) => {
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa) {
      setEditingTarefa(tarefa);
      setIsEditing(true);
    }
  };

  // Função para tratar mudanças nos inputs do modal de edição
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTarefa({
      ...editingTarefa,
      [name]: value
    });
  };

  // Função para atualizar a tarefa editada
  const updateTarefa = async () => {
    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas/${editingTarefa.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingTarefa)
      });
      if (response.ok) {
        // Atualiza a lista de tarefas localmente
        setTarefas(tarefas.map(t => t.id === editingTarefa.id ? editingTarefa : t));
        setIsEditing(false);
        alert('Tarefa atualizada com sucesso!');
      } else {
        console.error("Erro ao atualizar tarefa");
      }
    } catch (error) {
      console.error("Erro na requisição de atualização:", error);
    }
  };

  // Função para fechar o modal de edição sem salvar
  const closeEditModal = () => {
    setIsEditing(false);
    setEditingTarefa({
      id: null,
      titulo: '',
      descricao: '',
      dataEntrega: ''
    });
  };

  // Buscando as tarefas quando o componente for montado
  useEffect(() => {
    fetchTarefas();
  }, []);

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th>Data de entrega</th>
            <th>Título</th>
            <th></th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map(item => (
            <tr key={item.id}>
              <td>{item.dataEntrega}</td>
              <td>{item.titulo}</td>
              <td className="status">
                <span className={`status-indicador ${item.statusCor}`}></span>
                {item.statusTexto}
              </td>
              <td>
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
            <div className="edit-field">
              {/* <label>Título:</label> */}
              <LoginsInput
                textoInput="Editar título da tarefa"
                name="titulo"
                value={editingTarefa.titulo}
                onChange={handleEditChange}
              />
            </div>
            <div className="edit-field">
              {/* <label>Descrição:</label> */}
              <Desciption
              description="Editar descrição"
              name="descricao"
              value={editingTarefa.descricao}
              onChange={handleEditChange} />
            </div>
            
            <div className="edit-field">
              {/* <label>Data de entrega:</label> */}
              <InputDate
                name="dataEntrega"
                value={editingTarefa.dataEntrega}
                onChange={handleEditChange}
              />

            </div>
            <div className="container-saveEventButton">
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
