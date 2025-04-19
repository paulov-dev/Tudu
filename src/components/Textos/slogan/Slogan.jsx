import React from "react";
import './Slogan.css';

function Slogan({ texto = "Organize com praticidade, realize com eficiência!" }) {
    return (
        <div>
            <div>
                <p>{texto}</p>
            </div>
        </div>
    );
}

export default Slogan;
