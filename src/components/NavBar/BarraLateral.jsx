import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BarraLateral.css'; // CSS para o estilo
import TuduTitle from '../Textos/Title/TuduTitle';


const BarraLateral = () => {
  // Estado para controlar o menu expandido e colapsado
  const [expandido, setExpandido] = useState(false); // Controla a visibilidade do segundo menu
  const [subMenuVisivel, setSubMenuVisivel] = useState(false); // Controla os submenus dentro do "Quadros"
  const [barraLateralExpandida, setBarraLateralExpandida] = useState(true); // Controla a visibilidade da barra lateral

  // Função para alternar a visibilidade do segundo menu
  const toggleMenu = () => {
    setExpandido(!expandido);
  };

  // Função para alternar a visibilidade dos submenus dentro de "Quadros"
  const toggleSubMenu = () => {
    setSubMenuVisivel(!subMenuVisivel);
  };

  // Função para alternar a visibilidade da barra lateral
  const toggleBarraLateral = () => {
    setBarraLateralExpandida(!barraLateralExpandida);
  };

  return (
    <div className={`sidebar ${barraLateralExpandida ? 'expandida' : 'colapsada'}`}>
     <TuduTitle></TuduTitle>
     <button className="toggle-button" onClick={toggleBarraLateral}>
        {barraLateralExpandida ? (
            <i className="fa-solid fa-chevron-left"></i> // Ícone de colapsar
        ) : (
            <i className="fa-solid fa-chevron-right"></i> // Ícone de expandir
        )}
    </button>
    <div className="NavBar-Container">
      <div className="menu-item">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <a className="menu-link">
            <i className="fa-solid fa-house"></i>
            <span>Calendario</span>
          </a>
        </Link>
        </div>
        <div className="menu-item">
          <div className="menu-link" onClick={toggleMenu}>
            <i className="fa-solid fa-border-all"></i>
            <span>Boards</span>
        </div>
        {expandido && (
          <div className="submenu">
            <div className="submenu-item">
              <Link to="/WorkItems" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-clipboard-list"></i>
                <span>Work Items</span>
              </Link>
            </div>
            <div className="submenu-item">
              <div className="submenu-toggle">
                <Link to="/Backlogs" style={{ textDecoration: 'none' }}>
                  <i className="fa-solid fa-table-list"></i>
                  <span>Backlogs</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>



    </div>
  );
};

export default BarraLateral;
