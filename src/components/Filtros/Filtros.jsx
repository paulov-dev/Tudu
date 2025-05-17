import React from 'react';
import "./Filtros.css";

export default function Filtros({ filtros, setFiltros }) {
  const { titulo, dataEntrega, status, prioridade } = filtros;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="containerFiltros">
      <div className="fieldGroup">
        <label>Título:</label>
        <input
          type="text"
          name="titulo"
          value={titulo}
          onChange={handleChange}
          placeholder="Digite o título"
        />
      </div>
      <div className="fieldGroup">
        <label>Data de entrega:</label>
        <input
          type="date"
          name="dataEntrega"
          value={dataEntrega}
          onChange={handleChange}
        />
      </div>
      <div className="fieldGroup">
        <label>Status:</label>
        <select name="status" value={status} onChange={handleChange}>
          <option value="">Todos</option>
          <option value="A fazer">A fazer</option>
          <option value="Em processo">Em processo</option>
          <option value="Concluído">Concluído</option>
        </select>
      </div>
      <div className="fieldGroup">
        <label>Prioridade:</label>
        <select name="prioridade" value={prioridade} onChange={handleChange}>
          <option value="">Todas</option>
          <option value="Não Urgente">Não Urgente</option>
          <option value="Pouco Urgente">Pouco Urgente</option>
          <option value="Muito Urgente">Muito Urgente</option>
        </select>
      </div>
    </div>
  );
}