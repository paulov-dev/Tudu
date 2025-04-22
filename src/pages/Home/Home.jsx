import InfoHome from "../../components/buttons/InfoHome/InfoHome";
import TuduTitle from "../../components/Textos/Title/TuduTitle";
import Email from "../EsqueciASenha/Email/Email";
import "./Home.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";


function Home() {
  // const Home = require('./server'); // Importa o arquivo server.js
// Aqui você pode executar outras configurações ou inicializações de seu projeto

  return (
    <div>
        <div className="toolbar">
            <div className="title-container">
                <TuduTitle></TuduTitle>
            </div>
            <div className="homebutton-container">
                <Link to={"./Email"}>
                    <button>Entrar</button>
                </Link>
                <Link to={"./Email"}>
                <button style={{ backgroundColor: "#fff", border: "1.5px solid #0167FF", color: "#0167FF" }}>Cadastrar</button>



                </Link>
            </div>
        </div>
            <div className="hometextos-container">
                <h1>Gerencie suas tarefas com simplicidade</h1>
                <p>Organize com praticidade, realize com eficiência!</p>
            </div>

            <div className="infohome-container">
                <InfoHome
                icone="fa-solid fa-calendar-check"
                titulo="Múltiplas visualizações"
                paragrafo="Alterne entre visualizações de calendário, lista ou cards para ver suas tarefas da forma que preferir."
                ></InfoHome>

                <InfoHome
                icone="fa-solid fa-clock"
                titulo="Datas de Início e Fim"
                paragrafo="Defina facilmente datas de início e conclusão para manter o controle de prazos importantes."
                ></InfoHome>

                <InfoHome
                icone="fa-solid fa-check"
                titulo="Acompanhamento Simples"
                paragrafo="Acompanhe o progresso das suas tarefas e celebre cada conclusão para manter a motivação."
                ></InfoHome>

            </div>

            <div className="rodapehome-container">
                <h3>Pronto para se organizar?</h3>
                <p>Comece a gerenciar suas tarefas hoje mesmo e aumente sua produtividade. 
                Experimente o TUDU gratuitamente!</p>
                <Link to={"./Email"}>
                    <button>Criar conta grátis</button>
                </Link>
            </div>


        
    </div>
  );
}

export default Home;
