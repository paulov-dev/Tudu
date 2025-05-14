import React from "react";
import "./CardItem.css";

function CardItem({ tarefa, onClick }) {
  const getPriorityClass = () => {
    switch(tarefa.prioridade) {
      case "Muito urgente": return "muito-urgente";
      case "Pouco urgente": return "pouco-urgente";
      default: return "não-urgente";
    }
  };

  return (
    <div 
      className={`card-item ${getPriorityClass()}`}
      onClick={() => onClick(tarefa)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(tarefa));
      }}
    >
      <div className="card-top-line"></div>
      <h3>{tarefa.titulo}</h3>
      <p>Status: {tarefa.status}</p>
      <p>Prioridade: {tarefa.prioridade}</p>
    </div>
  );
}

export default CardItem;

