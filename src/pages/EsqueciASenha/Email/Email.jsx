import React, { useState } from 'react';
import TuduTitle from '../../../components/Textos/Title/TuduTitle';
import Slogan from '../../../components/Textos/slogan/Slogan';
import LoginsInput from '../../../components/inputs/LoginsInput';
import LoginTitle from '../../../components/Textos/Title/LoginTitle';
import LoginButton from '../../../components/buttons/LoginButtons/LoginButton'
import Rodape from '../../../components/Textos/Rodape/Rodape';
import ParagrafoEsqueceuSenha from '../../../components/Textos/ParagrafoEsqueceuSenha/ParagrafoEsqueceuSenha';
import LoginTitleText from '../../../components/Textos/Title/LoginTitleText';

import './Email.css';

function Email() {
  return (
    <div>

        <div className="boxCreate">
        <div className="boxItens">
        <div className='esqueceuasenha-container'>
            <LoginTitleText LoginTitleChange="Esqueceu a senha?"></LoginTitleText>

            <div className='paragrafoEmail-container'>
                <ParagrafoEsqueceuSenha></ParagrafoEsqueceuSenha>
            </div>
        </div>

        {/* Entradas de dados do usuário */}
        <div className='inputemail-container'>
            <LoginsInput textoInput="E-mail" IconLoginInput='fa-solid fa-envelope' />
        </div>

        {/* Botões de login e cadastro */}
        <div className='NextButton-container'>
            <LoginButton textoLoginButton="Próximo" />

        </div>
        </div>
    </div>

      {/* Título e slogan */}
      <div className='title-container'>
        <TuduTitle />
        <div className='slogan-container'>
        <Slogan texto=
        {<> Não se preocupe! <br />
        Vamos te ajudar.</>} />
        </div>
      </div>
      {/* Caixa de criação de evento */}

      {/* <Rodape></Rodape> */}

    </div>
  );
}

export default Email;
