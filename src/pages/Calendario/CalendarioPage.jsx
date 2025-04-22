import React, { useState } from 'react';

import './CalendarioPage.css';
import BarraLateral from '../../components/NavBar/BarraLateral';
import Calendarioo2 from '../../components/Calendario/Calendarioo2';

function CalendarioPage() {
  return (
    <div>
        <BarraLateral></BarraLateral>
        <Calendarioo2></Calendarioo2>

    </div>
  );
}

export default CalendarioPage;
