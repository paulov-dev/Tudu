import React from "react";
import "./LoginTitle.css";
import LoginTitleImagem from "../../imagem/LoginTitleImagem";
import ParagrafoEsqueceuSenha from "../../Textos/ParagrafoEsqueceuSenha/ParagrafoEsqueceuSenha";
function LoginTitleText({ LoginTitleChange }) {
  return (
    <div>
      <div className="container-text-loginTitleText">
        <h1 className="text-loginTitle">
          {LoginTitleChange ? LoginTitleChange : "Crie uma conta"}
        </h1>
      </div>
    </div>
  );
}

export default LoginTitleText;
