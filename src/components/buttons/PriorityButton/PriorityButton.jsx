import React from "react";
import "./PriorityButton.css";

function PriorityButton({ PriorityText, backgroundColor, FunctionPrioritybtn, icone }) {
  return (
    <div className="PriorityButton-container">
      <button
        className="PriorityButton"
        style={{ backgroundColor }}
        onClick={FunctionPrioritybtn} // Garantindo que a função está sendo chamada
        
      >
        {PriorityText}
        <i class={icone}></i>
      </button>
    </div>
  );
}

export default PriorityButton;
