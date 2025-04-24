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
    status: "A fazer",           // ADICIONADO: inicializa status
    prioridade: "Não urgente",   // ADICIONADO: inicializa prioridade
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [refresh, setRefresh] = useState(false); // Estado para forçar atualização
  const [isOpen, setIsOpen] = useState(false);

  // Função para lidar com a mudança do input dos dados da tarefa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa({
      ...tarefa,
      [name]: value      // já genérico, agora também captura status e prioridade
    });
  };

  // Função para lidar com a pesquisa
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchTarefas(term);
  };

  // Função para buscar tarefas
  const fetchTarefas = async (term = "") => {
    try {
      const url = term
        ? `https://localhost:7071/api/Tarefas?titulo=${term}`
        : "https://localhost:7071/api/Tarefas";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTarefas(data);
      } else {
        console.error("Erro ao buscar tarefas");
      }
    } catch (error) {
      console.error("Erro na requisição", error);
    }
  };

  // Carrega todas as tarefas inicialmente e quando o estado refresh mudar
  useEffect(() => {
    fetchTarefas(searchTerm);
  }, [refresh, searchTerm]);

  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    // Garante que a data está no formato correto para o backend
    const data = new Date(dataString);
    return data.toISOString();
  };

  const AddEvent = async () => {
    if (!tarefa.titulo || !tarefa.dataInicio || !tarefa.dataEntrega) {
      alert("Preencha o título, a data de início e a data de entrega!");
      return;
    }

    const tarefaFormatada = {
      ...tarefa,
      dataInicio: formatarData(tarefa.dataInicio),
      dataEntrega: formatarData(tarefa.dataEntrega),
      // status e prioridade já incluídos em tarefa
    };

    try {
      const response = await fetch("https://localhost:7071/api/Tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaFormatada), // inclui status e prioridade
      });

      if (response.ok) {
        const result = await response.json();
        alert("Tarefa criada com sucesso! ID: " + result.id);

        setTarefa({
          titulo: "",
          descricao: "",
          dataEntrega: "",
          dataInicio: "",
          status: "A fazer",         // RESET: status volta ao padrão
          prioridade: "Não urgente", // RESET: prioridade volta ao padrão
        });

        setRefresh(!refresh);
      } else {
        const errorText = await response.text();
        alert("Erro ao criar tarefa: " + errorText);
      }
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Erro ao criar tarefa: " + error.message);
    }

    setIsOpen(false);
  };

  return (
    <div className="CreateEvent-container">
      <BarraLateral />

      {/* --- ALTERADO: área de busca com layout flexível --- */}
      <div className="search-area">
        <AddEventButton AddEvent={openPopup} />
        <LoginsInput
          textoInput="Pesquisa"
          IconLoginInput="fa-solid fa-magnifying-glass"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Passa as tarefas para o componente TabelaItens */}
      <TabelaItens tarefasList={tarefas} onUpdate={() => setRefresh(!refresh)} />

      {isOpen && (
        <div className="popup-overlay">
          {/* --- ALTERADO: popup-content com flex column para layout consistente --- */}
          <div className="popup-content">
            <h4>Nova Tarefa</h4>

            {/* título */}
            <div className="form-row">
              <LoginsInput
                textoInput="Título da tarefa"
                name="titulo"
                value={tarefa.titulo}
                onChange={handleChange}
              />
            </div>

            {/* descrição */}
            <div className="form-row">
              <Desciption
                description="Descrição"
                name="descricao"
                value={tarefa.descricao}
                onChange={handleChange}
              />
            </div>

            {/* --- ALTERADO: duas colunas para datas lado a lado --- */}
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

            {/* --- ADICIONADO: duas colunas para selects Status e Prioridade --- */}
            <div className="form-row two-cols">
              <div className="field">
                <label>Status</label>
                <select name="status" value={tarefa.status} onChange={handleChange}>
                  <option>A fazer</option>
                  <option>Em processo</option>
                  <option>Concluido</option>
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

            {/* --- ALTERADO: botões alinhados à direita em buttons-row --- */}
            <div className="form-row buttons-row">
              <PriorityButton
                PriorityText="Cancelar"
                backgroundColor="var(--Borda)"
                FunctionPrioritybtn={closePopup}
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