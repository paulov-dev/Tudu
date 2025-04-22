
import "./InfoHome.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";


function InfoHome({icone, titulo, paragrafo}) {
  return (
    <div>
        <div className="infobox">
            <div className="icon-cicle">
                <i class={icone}></i>
            </div>
            <div className="infotexts-box">
                <h3>{titulo}</h3>
                <p>{paragrafo}</p>
            </div>
        </div>
    </div>
  );
}

export default InfoHome;
