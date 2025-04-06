import React from "react";
import "./LoginTitle.css";
import LoginTitleImagem from "../../imagem/LoginTitleImagem";
import ParagrafoEsqueceuSenha from "../../Textos/ParagrafoEsqueceuSenha/ParagrafoEsqueceuSenha";
import LoginTitleText from "./LoginTitleText";

function LoginTitle({ LoginTitleChange, textParagrafo }) {
  return (
    <div>
      <div className="container-text-loginTitle">
        <h1 className="text-loginTitle">
          {LoginTitleChange ? LoginTitleChange : "Crie uma conta"}
        </h1>

        {LoginTitleChange === "Esqueceu a senha?" ? (
          <div>
            <div className="container-text-EsqueceuSenha">
              <p className="text-ParagrafoEsqueceuSenha">
                {textParagrafo
                  ? textParagrafo
                  : "Primeiro, nos informe seu e-mail"}
              </p>
            </div>
          </div>
        ) : (
          <LoginTitleImagem />
        )}
      </div>
    </div>
  );
}

export default LoginTitle;
