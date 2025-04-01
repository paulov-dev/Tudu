import React from "react";
import "./LoginTitle.css";

function LoginTitle({ LoginTitleChange }) {
  return (
    <div>
      <div className="container-text-loginTitle">
        <h1 className="text-loginTitle">
          {LoginTitleChange ? LoginTitleChange : "Crie uma conta"}
        </h1>
      </div>
    </div>
  );
}

export default LoginTitle;
