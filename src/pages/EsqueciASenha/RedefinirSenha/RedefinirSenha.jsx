import React, { useState } from 'react';
import TuduTitle from '../../../components/Textos/Title/TuduTitle';
import Slogan from '../../../components/Textos/slogan/Slogan';
import LoginsInput from '../../../components/inputs/LoginsInput';
import LoginTitle from '../../../components/Textos/Title/LoginTitle';
import LoginButton from '../../../components/buttons/LoginButtons/LoginButton'
import Rodape from '../../../components/Textos/Rodape/Rodape';
import ParagrafoEsqueceuSenha from '../../../components/Textos/ParagrafoEsqueceuSenha/ParagrafoEsqueceuSenha';
import LoginTitleText from '../../../components/Textos/Title/LoginTitleText';
import { Link } from "react-router-dom";

import './RedefinirSenha.css';

function RedefinirSenha() {
  return (
    <div>

        <div className="boxCreate">
        <div className="boxItens">
        <div className='esqueceuasenha-container'>
            <LoginTitleText LoginTitleChange="Esqueceu a senha?"></LoginTitleText>

            <div className='paragrafoRedefinirSenha-container'>
                <ParagrafoEsqueceuSenha textParagrafo={'Defina sua nova senha'}></ParagrafoEsqueceuSenha>
            </div>
        </div>

        {/* Entradas de dados do usuário */}
        <div className='inputRedefinirSenha-container'>
            <LoginsInput textoInput="Nova senha" IconLoginInput='fa-solid fa-lock' />
            <LoginsInput textoInput="Confirme a senha" IconLoginInput='fa-solid fa-lock' />
        </div>

        {/* Botões de login e cadastro */}
        <div className='NextButton-container'>
            <LoginButton textoLoginButton="Redefinir" rota="/" />

        </div>
        </div>
    </div>

      {/* Título e slogan */}
      <div className='title-container'>
        <TuduTitle />
        <div className='slogan-container'>
        <Slogan texto=
        {<>Agora digite a senha conforme as regras <br />
        de segurança!</>} />
        </div>
      </div>

      <div className="regras-container"> 
                <p className="regras-text" > Confira nossas 
                    <span className="textblue"> Regras de Segurança </span> </p>
            </div>
      {/* Caixa de criação de evento */}

      {/* <Rodape></Rodape> */}

    </div>
  );
}

export default RedefinirSenha;
