import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import CreateCardsBacklog from "./pages/CreateCardsBacklog/CreateCardsBacklog";
import Create from "./pages/iniciais/Create";
import NavBarPage from "./pages/NavBarPage/NavBarPage";
import Email from "./pages/EsqueciASenha/Email/Email";
import Codigo from "./pages/EsqueciASenha/Codigo/Codigo";
import RedefinirSenha from "./pages/EsqueciASenha/RedefinirSenha/RedefinirSenha";
import Calendario from "./components/Calendario/Calendario";
import Calendarioo2 from "./components/Calendario/Calendarioo2";
import CalendarioPage from "./pages/Calendario/CalendarioPage";
import Home from "./pages/Home/Home";
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Email" element={<Email />} />
          <Route path="/Codigo" element={<Codigo />} />
          <Route path="/RedefinirSenha" element={<RedefinirSenha />} />
          <Route path="/Calendario" element={<CalendarioPage />} />
          <Route path="/Home" element={<h1>Home</h1>} />
          <Route path="/WorkItems" element={<CreateEvent />} />
          <Route path="/Backlogs" element={<CreateCardsBacklog />} />
          <Route path="*" element={<h1>Não encontramos</h1>} />
        </Routes>
      </BrowserRouter>

      {/* <Calendario /> */}
      {/* <Calendarioo2 /> */}
    </div>
  );
}


export default App;
