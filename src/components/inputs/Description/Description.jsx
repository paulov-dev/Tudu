import React from "react";
import "./Description.css";

function Desciption({ name, value, onChange }) {
  return (
    <div className="Desciption-container">
      <h4 className="Description-Title">Descrição</h4>
      <textarea
        className="Desciption-input"
        name={name}
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
}

export default Desciption;

