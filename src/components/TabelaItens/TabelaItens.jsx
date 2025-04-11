import React, { useEffect, useState } from "react";
import "./TabelaItens.css";

function TabelaItens() {
  const [tarefas, setTarefas] = useState([]);

  // Função para buscar as tarefas da API
  const fetchTarefas = async () => {
    try {
      const response = await fetch('https://localhost:7274/api/Tarefa'); // Atualize a URL conforme necessário
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaItens;
