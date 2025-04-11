import React from "react";
import "./InputDate.css";

function InputDate({ name, value, onChange }) {
  return (
    <input
      type="date"
      className="input-date"
      name={name}
      value={value}
      onChange={onChange}
    />
  );
}

export default InputDate;
