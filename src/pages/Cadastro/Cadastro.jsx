// pages/Cadastro.jsx
import React, { useState } from 'react';
import TuduTitle from '../../components/Textos/Title/TuduTitle';
import Slogan from '../../components/Textos/slogan/Slogan';
import LoginTitleText from '../../components/Textos/Title/LoginTitleText';
import LoginTitleImagem from '../../components/imagem/LoginTitleImagem';
import LoginsInput from '../../components/inputs/LoginsInput';
import InputDate from '../../components/inputs/InputDate/InputDate';
import LoginButton from '../../components/buttons/LoginButtons/LoginButton';
import RequestButton from '../../components/buttons/RequestButton/RequestButton';
import Rodape from '../../components/Textos/Rodape/Rodape';
import './Cadastro.css';
import InputDateDataNasc from '../../components/inputs/InputDate/InputDateDataNasc';

function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log('Enviando dados para API de cadastro:', { username, email, senha, dataNasc });
    setLoading(true);

    try {
      const response = await fetch('https://localhost:7071/api/Account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: username,
          Email: email,
          Password: senha,
          DataNascimento: dataNasc,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cadastro realizado com sucesso:', data);
        alert(data.Message || 'Cadastro realizado com sucesso!');
      } else {
        const errorText = await response.text();
        console.error('Erro no cadastro:', errorText);
        alert('Erro no cadastro: ' + errorText);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      alert('Erro de conexão com a API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="left-panel">
        <TuduTitle />
        <div className="slogan-container">
          <Slogan />
        </div>
        <div className="terms-container"></div>
        <div className="rodape-container">
          <Rodape />
        </div>
      </div>

      <div className="right-panel">
        <div className="boxCreate">
          <div className="boxItens">
            <div className="social-header">
              <LoginTitleText LoginTitleChange="Crie uma conta" />
              <LoginTitleImagem />
            </div>

            <div className="inputs-container">
              <LoginsInput
                textoInput="Nome de usuário"
                IconLoginInput="fa-solid fa-user"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <LoginsInput
                textoInput="Email"
                IconLoginInput="fa-solid fa-envelope"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <LoginsInput
                textoInput="Senha"
                IconLoginInput="fa-solid fa-lock"
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
                <div className="input-nascimento-wrapper">
                <InputDateDataNasc
                  value={dataNasc}
                  onChange={e => setDataNasc(e.target.value)}
                />
              </div>
            </div>

            <div className="buttons-container">
              {/* Botão de cadastro que chama a API */}
              <RequestButton
                label={loading ? 'Cadastrando...' : 'Cadastrar'}
                onClick={handleRegister}
                disabled={loading}
              />
              <div className="or-text">Ou</div>
              {/* Botão de Entrar que navega para página de login */}
              <LoginButton
                textoLoginButton="Entrar"
                rota="/Login"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
