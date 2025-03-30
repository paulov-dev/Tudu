import React from "react";
import "./PriorityButton.css"; // Importando o arquivo CSS

function PriorityButton({PriorityText, backgroundColor}) {
    return (
        <div className="PriorityButton-container">
            <button className="PriorityButton" style={{backgroundColor}}>{PriorityText}</button>
            
        </div>
    );
}

export default PriorityButton;
