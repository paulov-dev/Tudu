import React from "react";
import "./InputDate.css";

function InputDateDataNasc({ name, value, onChange }) {
  return (
    <div className="inputDate-container">
    <input
      type="date"
      className="InputDatecustom-input"
      name={name}
      value={value}
      onChange={onChange}
    />
    </div>
  );
}

export default InputDateDataNasc;
