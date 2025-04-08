import React, {useState} from "react";
import "./CreateEvent.css"; // Importando o arquivo CSS
import LoginsInput from "../../components/inputs/LoginsInput";
import Desciption from "../../components/inputs/Description/Description";
import PriorityButton from "../../components/buttons/PriorityButton/PriorityButton";
import AddEventButton from "../../components/buttons/AddEventButton/AddEventButton";
import BarraLateral from "../../components/NavBar/BarraLateral";
import TabelaItens from "../../components/TabelaItens/TabelaItens";

function CreateEvent() {
    // Cria o estado pra controlar o popup
    const [isOpen, setIsOpen] = useState(false);

    //Função para botão de abrir o popup
    const openPopup = () => {
        setIsOpen(true); //abre o popup
    };

    //Função para botao de fechar o popup
    const closePopup = () =>{
        setIsOpen(false); //fecha o popup
    };


    return (
        <div className="CreateEvent-container">

            <BarraLateral/>
           
            {/* <button className="open-popup-btn" onClick={openPopup}>Abrir</button> */}
            <div className="Container-LoginInput"> 
                <AddEventButton AddEvent={openPopup}></AddEventButton>
                <LoginsInput textoInput="Pesquisa" IconLoginInput="fa-solid fa-magnifying-glass"></LoginsInput>
            </div>
            <TabelaItens></TabelaItens>
           {isOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="box-Input-Tarefa">
                            {/* <LoginsInput textoInput="Título da tarefa"></LoginsInput> */}
                        </div>                        
                        <Desciption></Desciption>

                        <div className="box-Priority-Button">
                            <PriorityButton PriorityText="Muito Urgente" backgroundColor="var(--PriorityRed)"></PriorityButton>
                            <PriorityButton PriorityText="Pouco Urgente" backgroundColor="var(--PriorityYellow)"></PriorityButton>
                            <PriorityButton PriorityText="Não Urgente"   backgroundColor="var(--PriorityBlue)"></PriorityButton>

                        </div>

                    <div className="container-saveEventButton">     
                    {/* <button onClick={closePopup}>Fechar</button> */}
                        <PriorityButton PriorityText="Fechar" backgroundColor="var(--Borda)" FunctionPrioritybtn={closePopup}></PriorityButton>
                        <PriorityButton PriorityText="Salvar" backgroundColor="var(--blue)" FunctionPrioritybtn={closePopup} className="saveEventButton"></PriorityButton>
                    </div>
                    </div>

                </div>


           )}
            
        </div>
    );
}

export default CreateEvent;
