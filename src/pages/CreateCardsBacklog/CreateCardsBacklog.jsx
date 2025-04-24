import React, { useState, useEffect } from "react";
import "./CreateCardsBacklog.css";
import BarraLateral from "../../components/NavBar/BarraLateral";
import TabelaCard from "../../components/buttons/CardItem/TabelaCard";
import LoginsInput from "../../components/inputs/LoginsInput";
import AddEventButton from "../../components/buttons/AddEventButton/AddEventButton";


function CreateCardsBacklog() {
  const [tarefas, setTarefas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);

  const fetchTarefas = async (term = "") => {
    try {
      const url = term
        ? `https://localhost:7071/api/Tarefas?titulo=${term}`
        : "https://localhost:7071/api/Tarefas";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTarefas(data);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setTarefas([
        { 
          id: 1, 
          titulo: "Tarefa Urgente", 
          descricao: "hj",
          dataInicio: "13/12/2004",
          dataEntrega: "26/04/2025",
          status: "A fazer", 
          prioridade: "Muito urgente" 
        },
        { 
          id: 2, 
          titulo: "Tarefa Normal", 
          descricao: "sos",
          dataInicio: "23/04/2025",
          dataEntrega: "26/04/2025",
          status: "Em processo", 
          prioridade: "Pouco urgente" 
        },
        { 
          id: 3, 
          titulo: "Tarefa Simples", 
          descricao: "sim",
          dataInicio: "21/04/2025",
          dataEntrega: "26/04/2025",
          status: "Concluído", 
          prioridade: "Não urgente" 
        },
        { 
            id: 4, 
            titulo: "Tarefa Geovana", 
            descricao: "não",
            dataInicio: "20/04/2025",
            dataEntrega: "26/04/2025",
            status: "Concluído", 
            prioridade: "Muito urgente" 
          }
      ]);
    }
  };

  useEffect(() => {
    fetchTarefas(searchTerm);
  }, [refresh, searchTerm]);

  return (
    <div className="app-container">
      <BarraLateral />
      
      <div className="main-content">
        
        
        
        {/* 
<div className="search-area">
  <LoginsInput
    textoInput="Pesquisar tarefa..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
*/}

        <TabelaCard 
          tarefasList={tarefas} 
          onUpdate={() => setRefresh(!refresh)} 
        />
      </div>
    </div>
  );
}

export default CreateCardsBacklog;