import React, { useState } from 'react';
import TuduTitle from '../../../components/Textos/Title/TuduTitle';
import Slogan from '../../../components/Textos/slogan/Slogan';
import LoginsInput from '../../../components/inputs/LoginsInput';
import ParagrafoEsqueceuSenha from '../../../components/Textos/ParagrafoEsqueceuSenha/ParagrafoEsqueceuSenha';
import LoginTitleText from '../../../components/Textos/Title/LoginTitleText';
import './Email.css';

function Email() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setMensagem('Por favor, preencha o e-mail.');
      return;
    }

    try {
      console.log("Enviando POST /forgot-password com corpo:", { email });

      const response = await fetch(
        'https://localhost:7071/api/Account/forgot-password',
        {
          method: 'POST',
          mode: 'cors',                        // ← explícito
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      );

      console.log("Resposta recebida:", response.status, response);

      if (response.ok) {
        setMensagem('Verifique seu e-mail para redefinir sua senha.');
      } else {
        const textoErro = await response.text();
        console.error('Erro ao solicitar reset:', response.status, textoErro);
        setMensagem(`Erro ${response.status}: ${textoErro || 'Tente novamente.'}`);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setMensagem('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="email-page">
      <div className="boxCreate">
        <div className="boxItens">
          <div className="esqueceuasenha-container">
            <LoginTitleText LoginTitleChange="Esqueceu a senha?" />
            <div className="paragrafoEmail-container">
              <ParagrafoEsqueceuSenha />
            </div>
          </div>

          <div className="inputemail-container">
            <LoginsInput
              textoInput="E-mail"
              IconLoginInput="fa-solid fa-envelope"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="NextButton-container">
            <button
              type="button"
              className="next-button"
              onClick={handleSubmit}
            >
              Próximo
            </button>

            {mensagem && (
              <p
                style={{
                  marginTop: '10px',
                  color: mensagem.startsWith('Erro') ? 'red' : 'green'
                }}
              >
                {mensagem}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="title-container">
        <TuduTitle />
        <div className="slogan-container">
          <Slogan texto={<>Não se preocupe!<br/>Vamos te ajudar.</>} />
        </div>
      </div>
    </div>
  );
}

export default Email;
