import React from "react";
import "./InputDate.css";

function InputDate({ name, value, onChange }) {
  return (
    <div className="inputDate-container">
    <input
      type="datetime-local"
      className="InputDatecustom-input"
      name={name}
      value={value}
      onChange={onChange}
    />
    </div>
  );
}

export default InputDate;
