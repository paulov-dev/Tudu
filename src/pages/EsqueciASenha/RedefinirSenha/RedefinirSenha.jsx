import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TuduTitle from '../../../components/Textos/Title/TuduTitle';
import Slogan from '../../../components/Textos/slogan/Slogan';
import LoginsInput from '../../../components/inputs/LoginsInput';
import LoginButton from '../../../components/buttons/LoginButtons/LoginButton';
import ParagrafoEsqueceuSenha from '../../../components/Textos/ParagrafoEsqueceuSenha/ParagrafoEsqueceuSenha';
import LoginTitleText from '../../../components/Textos/Title/LoginTitleText';
import './RedefinirSenha.css';

function RedefinirSenha() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('https://localhost:7071/api/Account/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword, confirmPassword }),
      });

      if (response.ok) {
        setMensagem('Senha redefinida com sucesso!');
        setTimeout(() => navigate('/'), 3000); // redireciona para login
      } else {
        const data = await response.json();
        setMensagem(data.title || 'Erro ao redefinir a senha.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro de conexão.');
    }
  };

  return (
    <div>
      <div className="boxCreate">
        <div className="boxItens">
          <div className='esqueceuasenha-container'>
            <LoginTitleText LoginTitleChange="Redefinir senha" />
            <div className='paragrafoRedefinirSenha-container'>
              <ParagrafoEsqueceuSenha textParagrafo={'Defina sua nova senha'} />
            </div>
          </div>

          <div className='inputRedefinirSenha-container'>
            <LoginsInput
              textoInput="Nova senha"
              IconLoginInput='fa-solid fa-lock'
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <LoginsInput
              textoInput="Confirme a senha"
              IconLoginInput='fa-solid fa-lock'
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className='NextButton-container'>
            {/* <LoginButton textoLoginButton="Redefinir" onClick={handleReset} /> */}
            <button onClick={handleReset}>Proximo</button>
            {mensagem && <p style={{ marginTop: '10px', color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}
          </div>
        </div>
      </div>

      <div className='title-container'>
        <TuduTitle />
        <div className='slogan-container'>
          <Slogan texto={<>Agora digite a senha conforme as regras <br />de segurança!</>} />
        </div>
      </div>

      <div className="regras-container"> 
        <p className="regras-text">Confira nossas 
          <span className="textblue"> Regras de Segurança </span>
        </p>
      </div>
    </div>
  );
}

export default RedefinirSenha;
