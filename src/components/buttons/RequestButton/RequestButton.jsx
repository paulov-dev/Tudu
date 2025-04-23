// RequestButton.jsx
import React from 'react';
import './RequestButton.css'; // Certifique-se de criar este arquivo de estilo

function RequestButton({ label, onClick, loading = false, disabled = false, className = '' }) {
  return (
    <button
      className={`request-button ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? 'Entrando...' : label}
    </button>
  );
}

export default RequestButton;
