import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./Filtros.css";  // Importando o arquivo CSS
import { Dropdown } from './DropFiltro';
import { MultiSelectDropdown } from "./MultiDrop";

import TuduTitle from "../Textos/Title/TuduTitle";

function Filtros() {
    const options = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
  ];

  const handleSelect = (value) => {
    console.log('Opção selecionada:', value);
  };
    const options2 = [
        { value: 'op1', label: 'Opção 1' },
        { value: 'op2', label: 'Opção 2' },
        { value: 'op3', label: 'Opção 3' },
    ];

    const handleSelection = (selectedValues) => {
        console.log('Opções selecionadas:', selectedValues);
    };
  
  return (
    <div>
       <div className="containerFiltros">
            <h1>Buscar</h1>
        <div className="containerDrop">
            <MultiSelectDropdown
                options={options2}
                onSelect={handleSelection}
                placeholder="Título"
            />

            <MultiSelectDropdown
                options={options2}
                onSelect={handleSelection}
                placeholder="Data de entrega"
            />

            <MultiSelectDropdown
                options={options2}
                onSelect={handleSelection}
                placeholder="Status"
            />

            <MultiSelectDropdown
                options={options2}
                onSelect={handleSelection}
                placeholder="Prioridade"
            />
            
    </div>
        
        </div> 


    </div>

  );
}

export default Filtros;
