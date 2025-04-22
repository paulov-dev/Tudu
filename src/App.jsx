import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import Create from "./pages/iniciais/Create";
import NavBarPage from "./pages/NavBarPage/NavBarPage";
import Email from "./pages/EsqueciASenha/Email/Email";
import Codigo from "./pages/EsqueciASenha/Codigo/Codigo";
import RedefinirSenha from "./pages/EsqueciASenha/RedefinirSenha/RedefinirSenha";
import Calendario from "./components/Calendario/Calendario";
import Calendarioo2 from "./components/Calendario/Calendarioo2";
import CalendarioPage from "./pages/Calendario/CalendarioPage";
import Home from "./pages/Home/Home";
function App() {
  // const app = require('./server'); // Importa o arquivo server.js
// Aqui você pode executar outras configurações ou inicializações de seu projeto

  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/Email" element={<Email></Email>} />
          <Route path="/Codigo" element={<Codigo></Codigo>} />
          <Route path="/RedefinirSenha" element={<RedefinirSenha />} />
          <Route path="/Calendario" element={<CalendarioPage></CalendarioPage>} />
          {/* <Route path="/Tarefa" element={} /> */}
          <Route path="/Home" element={<Link to={<CreateEvent></CreateEvent>}><h1>Home</h1></Link>} />
          <Route path="/WorkItems" element={<CreateEvent></CreateEvent>} />
          <Route path="/Backlogs" element={<h1>Backlogs</h1>} />
          <Route path="*" element={<h1>Não encontramos</h1>} />
        </Routes>
      </BrowserRouter>
      {/* <Calendario></Calendario> */}
      {/* <Calendarioo2></Calendarioo2> */}


    </div>
  );
}

export default App;
