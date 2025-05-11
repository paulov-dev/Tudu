import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./BarraTopo.css";  // Importando o arquivo CSS

import TuduTitle from "../Textos/Title/TuduTitle";

function BarraTopo() {
  return (
    <header className="header-navigation">
      <div className="logo-container">
        <TuduTitle />  {/* Aqui você pode colocar seu título ou logo */}
      </div>
      <div className="linkNavigation">
        <Button color="inherit" component={Link} to="/Calendario">
          Calendário
        </Button>
        <Button color="inherit" component={Link} to="/Backlogs">
          Quadros
        </Button>
        <Button color="inherit" component={Link} to="/Workitems">
          Lista
        </Button>
      </div>
    </header>
  );
}

export default BarraTopo;
