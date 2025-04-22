import React from 'react';
import TuduTitle from '../../components/Textos/Title/TuduTitle';
import Slogan from '../../components/Textos/slogan/Slogan';
import LoginTitleText from '../../components/Textos/Title/LoginTitleText';
import LoginTitleImagem from '../../components/imagem/LoginTitleImagem';
import LoginsInput from '../../components/inputs/LoginsInput';
import LoginButton from '../../components/buttons/LoginButtons/LoginButton';
import Rodape from '../../components/Textos/Rodape/Rodape';

import './Login.css'; // Novo CSS específico do Login

function Login() {
  return (
    <div className="login-page">

      {/* Painel esquerdo */}
      <div className="left-panel">
        <TuduTitle />
        <div className="slogan-container">
          <Slogan />
        </div>
        <div className="rodape-container">
          <Rodape />
        </div>
      </div>

      {/* Painel direito com formulário */}
      <div className="right-panel">
        <div className="boxLogin">
          <div className="boxItens">
            <div className="social-header">
              <LoginTitleText LoginTitleChange="Entrar na sua conta" />
              <LoginTitleImagem />
            </div>

            <div className="inputs-container">
              <LoginsInput textoInput="Email" IconLoginInput="fa-solid fa-envelope" />
              <LoginsInput textoInput="Senha" IconLoginInput="fa-solid fa-lock" type="password" />
            </div>

            <div className="buttons-container">
              <p style={{ fontSize: '12px', marginTop: '10px' }}>Esqueceu a senha?</p>
              <LoginButton textoLoginButton="Entrar" rota="/Home" />
              <div className="or-text">Ou</div>
              <LoginButton textoLoginButton="Cadastrar" rota="/Cadastro" variant="outline" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
