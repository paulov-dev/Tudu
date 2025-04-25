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
      // Se quiser filtrar: use o endpoint /filtrar?titulo=
      const url = term
        ? `https://localhost:7071/api/Tarefas/filtrar?titulo=${encodeURIComponent(term)}`
        : "https://localhost:7071/api/Tarefas";
      
      const response = await fetch(url, {
        credentials: "include"  // ← envia cookie de autenticação
      });

      if (response.ok) {
        const data = await response.json();
        setTarefas(data);
      } else {
        const err = await response.text();
        console.error("Erro ao buscar tarefas:", response.status, err);
        alert(`Erro ${response.status} ao buscar tarefas: ${err}`);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      alert("Falha na conexão ao buscar tarefas.");
      // fallback de exemplo
      setTarefas([
        { 
          id: 1, 
          titulo: "Tarefa Urgente", 
          descricao: "hj",
          dataInicio: "2004-12-13T00:00:00.000Z",
          dataEntrega: "2025-04-26T00:00:00.000Z",
          StatusTarefa: "A fazer", 
          Prioridade: "Muito urgente" 
        },
        // ... demais exemplos
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
        {/* Se quiser habilitar busca, descomente */}
        {/* 
        <div className="search-area">
          <LoginsInput
            textoInput="Pesquisar tarefa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        */}
        {/*<AddEventButton AddEvent={() => setRefresh(!refresh)} />*/}
        <TabelaCard 
          tarefasList={tarefas} 
          onUpdate={() => setRefresh(!refresh)} 
        />
      </div>
    </div>
  );
}

export default CreateCardsBacklog;
