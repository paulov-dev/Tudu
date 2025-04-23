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
    titulo: '',
    descricao: '',
    dataEntrega: '',
    dataInicio: '',
    // tipo: 'atividade'
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [tarefas, setTarefas] = useState([]);
  const [refresh, setRefresh] = useState(false); // Estado para forçar atualização

  // Função para lidar com a mudança do input dos dados da tarefa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa({
      ...tarefa,
      [name]: value
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

  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    
    // Garante que a data está no formato correto para o backend
    // O formato ideal seria "YYYY-MM-DDThh:mm:ss"
    const data = new Date(dataString);
    return data.toISOString();
  };

  const AddEvent = async () => {
    if (!tarefa.titulo || !tarefa.dataInicio || !tarefa.dataEntrega) {
      alert('Preencha o título, a data de início e a data de entrega!');
      return;
    }
  
    const tarefaFormatada = {
      ...tarefa,
      dataInicio: formatarData(tarefa.dataInicio),
      dataEntrega: formatarData(tarefa.dataEntrega)
    };
  
    try {
      const response = await fetch('https://localhost:7071/api/Tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefaFormatada),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Tarefa criada com sucesso! ID: ' + result.id);
  
        setTarefa({
          titulo: '',
          descricao: '',
          dataEntrega: '',
          dataInicio: '',
          tipo: 'atividade'
        });
  
        setRefresh(!refresh);
      } else {
        const errorText = await response.text();
        alert('Erro ao criar tarefa: ' + errorText);
      }
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert('Erro ao criar tarefa: ' + error.message);
    }
  
    setIsOpen(false);
  };
  

  return (
    <div className="CreateEvent-container">
      <BarraLateral />

      <div className="Container-LoginInput">
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
          <div className="popup-content">
            <div className="box-Input-Tarefa">
              <h4>Nova Tarefa</h4>
              <LoginsInput
                textoInput="Título da tarefa"
                name="titulo"
                value={tarefa.titulo}
                onChange={handleChange}
              />
            </div>

            <Desciption
              description="Descrição"
              name="descricao"
              value={tarefa.descricao}
              onChange={handleChange}
            />

            <div className="box-Priority-Button">
              <p>Data inicial</p>
              <InputDate
                name="dataInicio"
                value={tarefa.dataInicio}
                onChange={handleChange}
              />
              
              <p>Data entrega</p>
              <InputDate
                name="dataEntrega"
                value={tarefa.dataEntrega}
                onChange={handleChange}
              />

              <div className="buttons">
                {/* Botões de prioridade, se necessário */}
              </div>
            </div>

            <div className="container-saveEventButton">
              <PriorityButton
                PriorityText="Fechar"
                backgroundColor="var(--Borda)"
                FunctionPrioritybtn={closePopup}
              />
              <PriorityButton
                PriorityText="Salvar"
                backgroundColor="var(--blue)"
                FunctionPrioritybtn={AddEvent}
                className="saveEventButton"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;