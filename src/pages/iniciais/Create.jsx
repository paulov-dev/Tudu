import React, { useState } from 'react';
import LoginsInput from '/src/components/inputs/LoginsInput.jsx';
import LoginButton from '/src/components/buttons/LoginButtons/LoginButton.jsx';
import TuduTitle from '/src/components/Textos/Title/TuduTitle.jsx';
import Slogan from '/src/components/Textos/slogan/Slogan.jsx';
import Rodape from '/src/components/Textos/Rodape/Rodape.jsx';
import AddEventButton from '/src/components/buttons/AddEventButton/AddEventButton.jsx';
import HomeButton from '/src/components/buttons/SidebarButtons/HomeButton.jsx';
import PriorityButton from '/src/components/buttons/PriorityButton/PriorityButton.jsx';
import Desciption from '/src/components/inputs/Description/Description.jsx';
import '/src/pages/iniciais/Create.css';

function Create() {
  return (
    <div>
      {/* Título e slogan */}
      <TuduTitle />
      <Slogan />

      {/* Caixa de criação de evento */}
      <div className="boxCreate">
        <div className="boxItens">
          <div>
            <LoginTitle LoginTitleChange="Esqueceu a senha?" />
          </div>

          {/* Entradas de dados do usuário */}
          <div>
            <LoginsInput textoInput="Nome de usuário" urlImg="src/assets/icons/perfil.png" />
            <LoginsInput textoInput="E-mail" urlImg="src/assets/icons/email.png" />
            <LoginsInput textoInput="Senha" urlImg="src/assets/icons/senha.png" />
          </div>

          {/* Botões de login e cadastro */}
          <div>
            <LoginButton textoLoginButton="Cadastrar" />
            <LoginButton textoLoginButton="Entrar" />
          </div>
        </div>
      </div>

      {/* Rodapé e outros botões */}
      <Rodape />
      <AddEventButton />
      <HomeButton />
      <PriorityButton PriorityText="Prioridade baixa" />
      <Desciption />
    </div>
  );
}

export default Create;
