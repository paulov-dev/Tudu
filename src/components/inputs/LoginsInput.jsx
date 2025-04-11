import React from "react";
import "./LoginsInput.css";

function LoginsInput({ textoInput, IconLoginInput, name, value, onChange }) {
  return (
    <div className="input-container">
      <input
        type="text"
        className="custom-input"
        placeholder={textoInput}
        name={name}
        value={value}
        onChange={onChange}
      />
      <i className={IconLoginInput}></i>
    </div>
  );
}

export default LoginsInput;
