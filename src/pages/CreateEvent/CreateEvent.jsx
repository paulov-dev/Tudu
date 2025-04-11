import React, { useState } from "react";
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
    dataEntrega: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa({
      ...tarefa,
      [name]: value
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
    console.log("Aberto");
  };

  const closePopup = () => {
    setIsOpen(false);
    console.log("fechado");
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
    } else {
      alert('Erro ao criar tarefa');
    }

    setIsOpen(false);
  };

  return (
    <div className="CreateEvent-container">
      <BarraLateral />

      <div className="Container-LoginInput">
        <AddEventButton AddEvent={openPopup}></AddEventButton>
        <LoginsInput
          textoInput="Pesquisa"
          IconLoginInput="fa-solid fa-magnifying-glass"
        ></LoginsInput>
      </div>

      <TabelaItens />

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="box-Input-Tarefa">
              <LoginsInput
                textoInput="Título da tarefa"
                name="titulo"
                value={tarefa.titulo}
                onChange={handleChange}
              />
            </div>

            <Desciption
              name="descricao"
              value={tarefa.descricao}
              onChange={handleChange}
            />

            <div className="box-Priority-Button">
              <InputDate
                name="dataEntrega"
                value={tarefa.dataEntrega}
                onChange={handleChange}
              />

              <div className="buttons">
                {/* Aqui você pode colocar os botões de prioridade se quiser */}
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
