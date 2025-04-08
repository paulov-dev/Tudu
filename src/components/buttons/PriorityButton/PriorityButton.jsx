import React from "react";
import "./PriorityButton.css"; // Importando o arquivo CSS

function PriorityButton({PriorityText, backgroundColor, FunctionPrioritybtn}) {
    return (
        <div className="PriorityButton-container">
            <button className="PriorityButton" style={{backgroundColor}} onClick={FunctionPrioritybtn}>{PriorityText}</button>
            
        </div>
    );
}

export default PriorityButton;
