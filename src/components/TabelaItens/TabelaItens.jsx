import React, { useEffect, useState } from "react";
import "./TabelaItens.css";
import AddEventButton from "../buttons/AddEventButton/AddEventButton";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";

function TabelaItens() {
  const [tarefas, setTarefas] = useState([]);

  // Função para buscar as tarefas da API
  const fetchTarefas = async () => {
    try {
      const response = await fetch('https://localhost:7071/api/Tarefas'); // Atualize a URL conforme necessário
      if (response.ok) {
        const data = await response.json();
        setTarefas(data); // Atualiza o estado com os dados da API
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
        // Atualiza a lista de tarefas após o delete
        setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
      } else {
        console.error("Erro ao deletar tarefa");
      }
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  // Função para editar uma tarefa
  const editTarefa = (id) => {
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    // Aqui você pode abrir um modal ou redirecionar para outra página com os detalhes para editar
    // Para fins de exemplo, vamos apenas exibir os dados no console
    console.log('Editar tarefa:', tarefa);
    // Implemente sua lógica de edição aqui (abrir modal, etc.)
  };

  // Usamos useEffect para buscar as tarefas assim que o componente for montado
  useEffect(() => {
    fetchTarefas(); // Chama a função quando o componente é carregado
  }, []);

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th>Data de entrega</th>
            <th>Título</th>
            <th>Status</th>
            <th> Ação</th>
          </tr>
        </thead>
        <tbody>
          {tarefas.map((item, index) => (
            <tr key={index}>
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
                  onClick={() => editTarefa(item.id)} // Editar tarefa
                />
                <PriorityButton 
                  PriorityText="Deletar" 
                  backgroundColor="red" 
                  onClick={() => deleteTarefa(item.id)} // Deletar tarefa
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaItens;
