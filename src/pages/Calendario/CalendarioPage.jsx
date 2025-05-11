import React, { useState } from 'react';

import './CalendarioPage.css';
import BarraLateral from '../../components/NavBar/BarraLateral';
import Calendarioo2 from '../../components/Calendario/Calendarioo2';
import BarraTopo from '../../components/NavBar/BarraTopo';

function CalendarioPage() {
  return (
    <div>
      
        {/* <BarraLateral></BarraLateral>*/}
        <div className="calendario2page">

          <Calendarioo2></Calendarioo2> 
        </div>
        
        <BarraTopo></BarraTopo>

    </div>
  );
}

export default CalendarioPage;
