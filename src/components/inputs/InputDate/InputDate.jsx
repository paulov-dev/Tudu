import React from "react";
import "./InputDate.css";

function InputDate({ textoInputDate, name, value, onChange }) {
  return (
    <div className="InputDate-container">
      <input
        type="date"
        className="InputDatecustom-input"
        placeholder={textoInputDate}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputDate;
