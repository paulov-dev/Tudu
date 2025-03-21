import React from "react";
import "./LoginButton.css"; // Importando o arquivo CSS

function LoginButton({textoLoginButton}) {
    return (
        <div className="LoginButton-container">
            <button className="LoginButton">{textoLoginButton}</button>
            
        </div>
    );
}

export default LoginButton;

