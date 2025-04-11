import React, {useState} from "react";
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
        // id: '',
        titulo: '',
        descricao: '',
        dataEntrega: '',
        // statusTexto: '',
        // statusCor: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setTarefa({
          ...tarefa,
          [name]: value
        });
      };

      const [isOpen, setIsOpen] = useState(false);   
      const openPopup = () =>{ 
          setIsOpen(true); //abre o popup
          console.log("Aberto")
      }
  
      //Função para botao de fechar o popup
      const closePopup = () =>{
          setIsOpen(false); //fecha o popup
          console.log("fechado")
      };

    const AddEvent = async () => {
        console.log("Tentando salvar a tarefa", tarefa); // Verificar os dados
        const response = await fetch('https://localhost:7274/api/Tarefa', {
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

        setIsOpen(false); // Fecha o popup
    };

    
    // Cria o estado pra controlar o popup


    //Função para botão de abrir o popup
    // const openPopup = () => {
    //     setIsOpen(true); //abre o popup
    // };



    return (
        <div className="CreateEvent-container">

            <BarraLateral/>
           
            {/* <button className="open-popup-btn" onClick={openPopup}>Abrir</button> */}
            <div className="Container-LoginInput"> 
                <AddEventButton AddEvent={openPopup}></AddEventButton>
                <LoginsInput textoInput="Pesquisa" IconLoginInput="fa-solid fa-magnifying-glass" ></LoginsInput>
            </div>
            <TabelaItens></TabelaItens>
           {isOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="box-Input-Tarefa">
                        {/* <LoginsInput
                            textoInput="Id"
                            name="id"
                            value={tarefa.id}
                            onChange={handleChange}
                        ></LoginsInput> */}

                        <LoginsInput
                            textoInput="Título da tarefa"
                            name="titulo"
                            value={tarefa.titulo}
                            onChange={handleChange}
                        ></LoginsInput>
                            
                        </div>                        
                        <Desciption
                            name="descricao"
                            value={tarefa.descricao}
                            onChange={handleChange}
                        ></Desciption>

                        <div className="box-Priority-Button">
                            <InputDate></InputDate>
                            <div className="buttons">
                                {/* <PriorityButton
                                    PriorityText="Muito Urgente"
                                    backgroundColor="var(--PriorityRed)"
                                    // onClick={() => setTarefa({ ...tarefa, statusTexto: "Muito Urgente", statusCor: "var(--PriorityRed)" })}
                                    ></PriorityButton>
                                    <PriorityButton
                                    PriorityText="Pouco Urgente"
                                    backgroundColor="var(--PriorityYellow)"
                                    // onClick={() => setTarefa({ ...tarefa, statusTexto: "Pouco Urgente", statusCor: "var(--PriorityYellow)" })}
                                    ></PriorityButton>
                                    <PriorityButton
                                    PriorityText="Não Urgente"
                                    backgroundColor="var(--PriorityBlue)"
                                    // onClick={() => setTarefa({ ...tarefa, statusTexto: "Não Urgente", statusCor: "var(--PriorityBlue)" })}
                                ></PriorityButton> */}
                            </div>
                        </div>

                        
                    <div className="container-saveEventButton">     
                    {/* <button onClick={closePopup}>Fechar</button> */}
                        <PriorityButton PriorityText="Fechar" backgroundColor="var(--Borda)" FunctionPrioritybtn={closePopup}></PriorityButton>
                        <PriorityButton
                            PriorityText="Salvar"
                            backgroundColor="var(--blue)"
                            FunctionPrioritybtn={AddEvent}  // Passar a função para o botão
                            className="saveEventButton" />

                    
                    </div>
                    </div>

                </div>


           )}
            
        </div>
    );
}

export default CreateEvent;
