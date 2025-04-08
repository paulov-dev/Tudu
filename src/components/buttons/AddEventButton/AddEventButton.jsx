import React from "react";
import "./AddEventButton.css"; // Importando o arquivo CSS

function AddEventButton({AddEvent}) {
    return (
        <div className="AddEventButton-container">
            <button className="open-popup-btn" onClick={AddEvent}><i class="fa-solid fa-plus"></i></button>
            
        </div>
    );
}

export default AddEventButton;
