import React from "react";
import './Rodape.css';

function Rodape () {
    return(
        <div>
            <div className="container-rodape"> 
                <p className="rodape-text" > Ao fazer a inscrição, aceito os 
                    <span className="textblue"> termos de serviço </span> 
                    e concordo com a 
                    <span className="textblue"> Política de Privacidade</span> do TUDU.</p>
            </div>
        </div>
    )
}


export default Rodape