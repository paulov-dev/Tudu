import React from "react";
import "./LoginsInput.css"; // Importando o arquivo CSS

function LoginsInput({ textoInput, urlImg }) {
  return (
    <div className="input-container">
      {/* <span class="input-group-addon" img src="src\assets\icons\perfil.png"></span> */}
      <img src={urlImg} className="input-icon" />

      <input type="text" className="custom-input" placeholder={textoInput} />
      {/* <img src="src\assets\icons\perfil.png"></img> */}
    </div>
  );
}

export default LoginsInput;
