import React, { useState, useEffect } from "react";
import "./CreateEvent.css";
import LoginsInput from "../../components/inputs/LoginsInput";
import Desciption from "../../components/inputs/Description/Description";
import PriorityButton from "../../components/buttons/PriorityButton/PriorityButton";
import AddEventButton from "../../components/buttons/AddEventButton/AddEventButton";
import BarraLateral from "../../components/NavBar/BarraLateral";
import TabelaItens from "../../components/TabelaItens/TabelaItens";
import InputDate from "../../components/inputs/InputDate/InputDate";

function CreateEvent() {
  const [tarefa, setTarefa] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataEntrega: "",
    statusTarefa: "A fazer",
    prioridade: "Não urgente"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa({
      ...tarefa,
      [name]: value
    });
  };

  const fetchTarefas = async (term = "") => {
    try {
      const url = term
        ? `https://localhost:7071/api/Tarefas/filtrar?titulo=${term}`
        : "https://localhost:7071/api/Tarefas";

      const response = await fetch(url, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTarefas(data);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  useEffect(() => {
    fetchTarefas(searchTerm);
  }, [refresh, searchTerm]);

  const formatarData = (dataString) => {
    if (!dataString) return "";
    return new Date(dataString).toISOString();
  };

  const AddEvent = async () => {
    if (!tarefa.titulo || !tarefa.dataInicio || !tarefa.dataEntrega) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const tarefaFormatada = {
      ...tarefa,
      dataInicio: formatarData(tarefa.dataInicio),
      dataEntrega: formatarData(tarefa.dataEntrega)
    };

    try {
      const response = await fetch("https://localhost:7071/api/Tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaFormatada),
        credentials: 'include',
        redirect: 'manual' // 👈 Impede seguir redirects automáticos
      });

      if (response.ok) {
        setTarefa({
          titulo: "",
          descricao: "",
          dataInicio: "",
          dataEntrega: "",
          statusTarefa: "A fazer",
          prioridade: "Não urgente"
        });
        setRefresh(!refresh);
        setIsOpen(false);
      } else if (response.status === 401) {
        alert("Você precisa estar logado para criar uma tarefa.");
      } else {
        const erro = await response.text();
        console.error("Erro ao criar tarefa:", erro);
        alert(`Erro ${response.status}: ${erro}`);
      }
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="CreateEvent-container">
      <BarraLateral />
      <div className="search-area">
        <AddEventButton AddEvent={() => setIsOpen(true)} />
        <LoginsInput
          textoInput="Pesquisar tarefas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <TabelaItens tarefasList={tarefas} onUpdate={() => setRefresh(!refresh)} />

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Nova Tarefa</h4>
            <div className="form-row">
              <LoginsInput
                textoInput="Título da tarefa"
                name="titulo"
                value={tarefa.titulo}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <Desciption
                description="Descrição"
                name="descricao"
                value={tarefa.descricao}
                onChange={handleChange}
              />
            </div>
            <div className="form-row two-cols">
              <div className="field">
                <label>Data de início</label>
                <InputDate
                  name="dataInicio"
                  value={tarefa.dataInicio}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label>Data de entrega</label>
                <InputDate
                  name="dataEntrega"
                  value={tarefa.dataEntrega}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-row two-cols">
              <div className="field">
                <label>Status</label>
                <select
                  name="statusTarefa"
                  value={tarefa.statusTarefa}
                  onChange={handleChange}
                >
                  <option>A fazer</option>
                  <option>Em processo</option>
                  <option>Concluído</option>
                </select>
              </div>
              <div className="field">
                <label>Prioridade</label>
                <select
                  name="prioridade"
                  value={tarefa.prioridade}
                  onChange={handleChange}
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
                FunctionPrioritybtn={() => setIsOpen(false)}
              />
              <PriorityButton
                PriorityText="Salvar"
                backgroundColor="var(--blue)"
                FunctionPrioritybtn={AddEvent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;

