import React from 'react';
import TuduTitle from '../../components/Textos/Title/TuduTitle';
import Slogan from '../../components/Textos/slogan/Slogan';
import LoginTitleText from '../../components/Textos/Title/LoginTitleText';
import LoginTitleImagem from '../../components/imagem/LoginTitleImagem';
import LoginsInput from '../../components/inputs/LoginsInput';
import LoginButton from '../../components/buttons/LoginButtons/LoginButton';
import Rodape from '../../components/Textos/Rodape/Rodape';

import './Cadastro.css';

function Cadastro() {
  return (
    <div className="cadastro-page">

      {/* Painel esquerdo: logo, slogan, termos e rodapé */}
      <div className="left-panel">
        <TuduTitle />
        <div className="slogan-container">
          <Slogan />
        </div>
        <div className="terms-container">
        </div>
        <div className="rodape-container">
          <Rodape />
        </div>
      </div>

      {/* Painel direito: formulário de cadastro */}
      <div className="right-panel">
        <div className="boxCreate">
          <div className="boxItens">
            {/* Título e ícones sociais */}
            <div className="social-header">
              <LoginTitleText LoginTitleChange="Crie uma conta" />
              <LoginTitleImagem />
            </div>

            {/* Inputs: usuário, email, senha */}
            <div className="inputs-container">
              <LoginsInput textoInput="Nome de usuário" IconLoginInput="fa-solid fa-user" />
              <LoginsInput textoInput="Email" IconLoginInput="fa-solid fa-envelope" />
              <LoginsInput textoInput="Senha" IconLoginInput="fa-solid fa-lock" type="password" />
            </div>

            {/* Botões */}
            <div className="buttons-container">
              <LoginButton textoLoginButton="Cadastrar" rota="/CadastroConfirmado" />
              <div className="or-text">Ou</div>
              <LoginButton textoLoginButton="Entrar" rota="/Login" variant="outline" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Cadastro;
