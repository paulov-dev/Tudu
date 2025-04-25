import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TuduTitle from '../../components/Textos/Title/TuduTitle';
import Slogan from '../../components/Textos/slogan/Slogan';
import LoginTitleText from '../../components/Textos/Title/LoginTitleText';
import LoginTitleImagem from '../../components/imagem/LoginTitleImagem';
import LoginsInput from '../../components/inputs/LoginsInput';
import LoginButton from '../../components/buttons/LoginButtons/LoginButton';
import RequestButton from '../../components/buttons/RequestButton/RequestButton';
import Rodape from '../../components/Textos/Rodape/Rodape';
import './Login.css';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('Enviando dados para API:', { email, senha, lembrar });
    setLoading(true);

    try {  // corrigido aqui
      const response = await fetch('https://localhost:7071/api/Account/login', {
        method: 'POST',  // corrigido aqui
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: senha,
          rememberMe: lembrar
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login realizado com sucesso:', data);
        alert(data.message || 'Login realizado com sucesso!');
        navigate('/Calendario');
      } else {
        const error = await response.text();
        console.error('Erro ao logar:', error);
        alert('Erro no login: ' + error);
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
              <LoginTitleText LoginTitleChange="Entrar na sua conta" />
              <LoginTitleImagem />
            </div>

            <div className="inputs-container">
              <LoginsInput
                textoInput="Email"
                IconLoginInput="fa-solid fa-envelope"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <LoginsInput
                textoInput="Senha"
                IconLoginInput="fa-solid fa-lock"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="lembrar"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                />
                <label htmlFor="lembrar">Lembrar de mim</label>
              </div>

              <div className="buttons-container">
              <RequestButton
                  label={loading ? 'Entrando...' : 'Entrar'}
                  onClick={handleLogin}
                  disabled={loading}
                />
                <div className="or-text">Ou</div>
                <LoginButton textoLoginButton="Cadastrar" rota="/Cadastro" />

                <Link to="/RedefinirSenha">Esqueci a senha</Link>
                
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
