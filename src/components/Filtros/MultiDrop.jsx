import { useState, useRef, useEffect } from 'react';

export function MultiSelectDropdown({ 
  options, 
  onSelect, 
  placeholder = 'Selecione', 
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
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

  const toggleOption = (option) => {
    const newSelectedOptions = selectedOptions.some(opt => opt.value === option.value)
      ? selectedOptions.filter(opt => opt.value !== option.value)
      : [...selectedOptions, option];
    
    setSelectedOptions(newSelectedOptions);
    onSelect(newSelectedOptions.map(opt => opt.value));
  };

  const displayText = selectedOptions.length > 0 
    ? selectedOptions.map(opt => opt.label).join(', ') 
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botão do dropdown */}
      <button
        type="button"
        className="w-61 h-10 flex justify-between items-center pl-3 pr-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-left flex-1">{displayText}</span>
        <div className="flex items-center">
          {selectedOptions.length > 0 && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full mr-2">
              {selectedOptions.length}
            </span>
          )}
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Lista de opções */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center px-3 py-2 hover:bg-indigo-50 cursor-pointer ${
                selectedOptions.some(opt => opt.value === option.value) 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-900'
              }`}
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={selectedOptions.some(opt => opt.value === option.value)}
                readOnly
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}