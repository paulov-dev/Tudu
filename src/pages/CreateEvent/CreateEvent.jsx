import React, {useState} from "react";
import "./CreateEvent.css"; // Importando o arquivo CSS
import LoginsInput from "../../components/inputs/LoginsInput";
import Desciption from "../../components/inputs/Description/Description";
import PriorityButton from "../../components/buttons/PriorityButton/PriorityButton";

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
            <button className="open-popup-btn" onClick={openPopup}>Abrir</button>
           
           {isOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="box-Input-Tarefa">
                            <LoginsInput textoInput="Título da tarefa" urlImg={""}></LoginsInput>
                        </div>                        
                        <Desciption></Desciption>

                        <div className="box-Priority-Button">
                            <PriorityButton PriorityText="Muito Urgente" backgroundColor="var(--PriorityRed)"></PriorityButton>
                            <PriorityButton PriorityText="Pouco Urgente" backgroundColor="var(--PriorityYellow)"></PriorityButton>
                            <PriorityButton PriorityText="Não Urgente"   backgroundColor="var(--PriorityBlue)"></PriorityButton>

                        </div>


                    <button onClick={closePopup}>Fechar</button>
                    </div>








                </div>


           )}
            
        </div>
    );
}

export default CreateEvent;
