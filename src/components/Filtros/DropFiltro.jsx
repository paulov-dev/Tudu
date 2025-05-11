import { useState, useRef, useEffect } from 'react';

export function Dropdown({ options, onSelect, placeholder = 'Selecione', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botão do dropdown */}
      <button
        type="button"
        className="w-24 h-8 flex justify-between items-center pl-5 py-2 bg-white border border-gray-300 rounded-sm shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Lista de opções */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-2 hover:bg-indigo-100 ${
                selectedOption?.value === option.value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-900'
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}