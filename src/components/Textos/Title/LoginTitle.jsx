import React from "react";
import "./LoginTitle.css";
import LoginTitleImagem from "../../imagem/LoginTitleImagem";

function LoginTitle({ LoginTitleChange }) {
  return (
    <div>
      <div className="container-text-loginTitle">
        <h1 className="text-loginTitle">
          {LoginTitleChange ? LoginTitleChange : "Crie uma conta"}
        </h1>
        {LoginTitleChange !== "Esqueceu a senha?" && <LoginTitleImagem />}
      </div>
    </div>
  );
}

export default LoginTitle;
