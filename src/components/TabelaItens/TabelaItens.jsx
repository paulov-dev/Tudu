import React from "react";
import "./TabelaItens.css";

function TabelaItens({ dados = [] }) {
  const dadosPadrao = [
    {
      dataEntrega: "12/03",
      titulo: "Entrega apresentação",
      statusTexto: "Em andamento",
      statusCor: "azul",
    },
    {
      dataEntrega: "16/03",
      titulo: "Atividade Monica",
      statusTexto: "Inativa",
      statusCor: "cinza",
    },
  ];

  const tarefas = dados.length > 0 ? dados : dadosPadrao;

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
