import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import Create from "./pages/iniciais/Create";
import NavBarPage from "./pages/NavBarPage/NavBarPage";

function App() {
  // const app = require('./server'); // Importa o arquivo server.js
// Aqui você pode executar outras configurações ou inicializações de seu projeto

  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateEvent />} />
          <Route path="/Home" element={<h1>Home</h1>} />
          <Route path="/WorkItems" element={<h1>Work Items</h1>} />
          <Route path="/Backlogs" element={<h1>Backlogs</h1>} />
          <Route path="*" element={<h1>Não encontramos</h1>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
