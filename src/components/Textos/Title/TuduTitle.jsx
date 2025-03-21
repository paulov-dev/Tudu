import React from "react";
import './TuduTittle.css';

function TuduTitle () {
    return(
        <div>
            <div className="container">
                <img src={"src/assets/icons/logo.png"} alt="Ícone de pesquisa" className="logoImg" />
                <div className="container-text">
                    <h1>Tudu</h1>
                    <h4>Gestão de Tarefas</h4>
                </div>
            </div>

        </div>
    )
}


export default TuduTitle
