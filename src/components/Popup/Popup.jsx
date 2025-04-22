import React from "react";
import "./Popup.css";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import { Link } from "react-router-dom";


function Popup({titulo, texto, funcao}) {
  return (
    <div className="Popup-container">
        <div className="popup-box">
            <h3>{titulo}</h3>
            <p>{texto}</p>
            <PriorityButton
                PriorityText="Fechar"
                backgroundColor="var(--Borda)"
                FunctionPrioritybtn={funcao}
              />
        </div>

    </div>
  );
}

export default Popup;
