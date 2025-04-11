import React from "react";
import "./PriorityButton.css";

function PriorityButton({ PriorityText, backgroundColor, FunctionPrioritybtn }) {
  return (
    <div className="PriorityButton-container">
      <button
        className="PriorityButton"
        style={{ backgroundColor }}
        onClick={FunctionPrioritybtn} // Garantindo que a função está sendo chamada
      >
        {PriorityText}
      </button>
    </div>
  );
}

export default PriorityButton;
