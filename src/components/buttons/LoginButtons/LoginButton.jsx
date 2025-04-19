import React from "react";
import { Link } from "react-router-dom"; // <-- IMPORTANTE!
import "./LoginButton.css";

function LoginButton({ textoLoginButton, rota }) {
    return (
        <div className="LoginButton-container">
            <Link to={rota} style={{ textDecoration: 'none' }}>
                <button className="LoginButton">{textoLoginButton}</button>
            </Link>
        </div>
    );
}

export default LoginButton;
