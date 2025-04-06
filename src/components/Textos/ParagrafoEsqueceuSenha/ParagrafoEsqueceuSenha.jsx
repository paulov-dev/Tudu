import React from "react";
import "./ParagrafoEsqueceuSenha.css";

function ParagrafoEsqueceuSenha({ textParagrafo }) {
  return (
    <div>
      <div className="container-text-EsqueceuSenha">
        <p className="text-ParagrafoEsqueceuSenha">
          {textParagrafo ? textParagrafo : "Primeiro, nos informe seu e-mail"}
        </p>
      </div>
    </div>
  );
}

export default ParagrafoEsqueceuSenha;
