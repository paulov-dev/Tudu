import React from "react";
import './Calendario.css'
import PriorityButton from "../buttons/PriorityButton/PriorityButton";

const EventModal = ({evento, onClose}) =>{
    return(
        <div className="modal">
            <div className="modal-content">
                <h2>{evento.title}</h2>
                <p>{evento.desc}</p>
                <p>Inicio: {evento.start.toLocaleString()}</p>
                <p>Final: {evento.end.toLocaleString()}</p>

                <PriorityButton
                PriorityText="Fechar"
                backgroundColor="var(--Borda)"
                FunctionPrioritybtn={onClose}
              />


            </div>
        </div>
    )
}

export default EventModal







