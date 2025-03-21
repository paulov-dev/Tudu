import React, { useState } from "react";
import "./HomeButton.css"; // Importando o arquivo CSS

function HomeButton() {
    // Estado para controlar a cor de fundo do botão
    const [backgroundColor, setBackgroundColor] = useState("#3498db"); // Cor inicial: azul
    const [imageSrc, setImageSrc] = useState("src/assets/icons/home.png"); // Imagem inicial

    // Função para alterar a imagem e a cor de fundo
    function alterarImg() {
        // Alterando a imagem
        if (imageSrc === "src/assets/icons/home.png") {
            setImageSrc("src/assets/icons/home-blue.png"); // Nova imagem
        } else {
            setImageSrc("src/assets/icons/home.png"); // Imagem original
        }

        // Alterando a cor de fundo
        if (backgroundColor === "#fff") {
            setBackgroundColor("#418dff"); // Nova cor de fundo (verde)
        } else {
            setBackgroundColor("#fff"); // Cor de fundo original (azul)
        }
    }

    return (
        <div className="AddEventButton-container">
            <button 
                className="home-button" 
                onClick={alterarImg}
                style={{ backgroundColor }} // Aplica a cor de fundo dinamicamente
            >
                <img src={imageSrc} alt="Ícone do botão" className="homeButton-Image" />
            </button>
        </div>
    );
}

export default HomeButton;
