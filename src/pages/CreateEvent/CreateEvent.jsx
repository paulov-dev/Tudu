import React, { useState, useEffect } from "react";
import "./CreateEvent.css"; // Importando o arquivo CSS
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
    dataInicio:'',
    dataEntrega: '',
    // color:'',
    tipo:'atividade'
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [tarefas, setTarefas] = useState([]);

  // Função para lidar com a mudança do input dos dados da tarefa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa({
      ...tarefa,
      [name]: value
    });
  };

  // Função para lidar com a pesquisa
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    try {
      const response = await fetch(`https://localhost:7071/api/Tarefas?titulo=${term}`);
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

  // Pode ser interessante carregar todas as tarefas inicialmente
  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const response = await fetch("https://localhost:7071/api/Tarefas");
        if (response.ok) {
          const data = await response.json();
          setTarefas(data);
        } else {
          console.error("Erro ao buscar todas as tarefas");
        }
      } catch (error) {
        console.error("Erro na requisição", error);
      }
    };

    fetchTarefas();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
    console.log("Aberto");
  };

  const closePopup = () => {
    setIsOpen(false);
    console.log("Fechado");
  };

  const AddEvent = async () => {
    console.log("Tentando salvar a tarefa", tarefa);
    const response = await fetch('https://localhost:7071/api/Tarefas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tarefa),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Tarefa criada com sucesso! ID: ' + result.id);
      // Atualiza a lista após a inclusão
      const novaLista = await fetch(`https://localhost:7071/api/Tarefas?titulo=${searchTerm}`);
      if (novaLista.ok) {
        setTarefas(await novaLista.json());
      }
    } else {
      alert('Erro ao criar tarefa');
    }

    setIsOpen(false);
  };

  return (
    <div className="CreateEvent-container">
      <BarraLateral />

      <div className="Container-LoginInput">
        <AddEventButton AddEvent={openPopup} />
        {/* Adiciona onChange e value para o input de pesquisa*/}
        <LoginsInput
          textoInput="Pesquisa"
          IconLoginInput="fa-solid fa-magnifying-glass"
          value={searchTerm}
          onChange={handleSearch}
        /> 
      </div>

      {/* Passa as tarefas filtradas para o componente que exibe a tabela */}
      <TabelaItens tarefas={tarefas} />

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
            <InputDate
                name="dataInicio"
                value={tarefa.dataInicio}
                onChange={handleChange}
              />
              <InputDate
                name="dataEntrega"
                value={tarefa.dataEntrega}
                onChange={handleChange}
              />
              <div className="buttons">
                {/* Aqui você pode colocar os botões de prioridade, se necessário */}
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

