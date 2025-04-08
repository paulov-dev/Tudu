import React from "react";
import "./LoginsInput.css"; // Importando o arquivo CSS

function LoginsInput({ textoInput, IconLoginInput}) {
  return (
    <div className="input-container">
      {/* <span class="input-group-addon" img src="src\assets\icons\perfil.png"></span> */}
      {/* <img src={urlImg} className="input-icon" /> */}
      <input
        type="text"
        className="custom-input"
        placeholder={textoInput}>
          
        </input>
      <i className={IconLoginInput}></i>
    </div>
  );
}

export default LoginsInput;
