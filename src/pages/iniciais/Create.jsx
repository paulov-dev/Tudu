// import './App.css'
import LoginsInput from '../../components/inputs/LoginsInput'
import LoginButton from '../../components/buttons/LoginButtons/LoginButton'
import './Create.css'
import TuduTitle from '../../components/Textos/Title/TuduTitle'
import Slogan from '../../components/Textos/slogan/Slogan'
import Rodape from '../../components/Textos/Rodape/Rodape'
import AddEventButton from '../../components/buttons/AddEventButton/AddEventButton'
import HomeButton from '../../components/buttons/SidebarButtons/HomeButton'
import PriorityButton from '../../components/buttons/PriorityButton/PriorityButton'
import Desciption from '../../components/inputs/Description/Description'

function Create() {

    return (
    
    <div> 
      <TuduTitle></TuduTitle>
      <Slogan></Slogan>
      <div className='boxCreate'>

        <div className='boxItens'>

          <div>
            <LoginsInput textoInput ="Nome de usuário" urlImg={"src/assets/icons/perfil.png"}/> 
            <LoginsInput textoInput ="E-mail" urlImg={"src/assets/icons/email.png"}/> 
            <LoginsInput textoInput ="Senha" urlImg={"src/assets/icons/senha.png"}/> 
          </div>
        
          <div>
            <LoginButton textoLoginButton="Cadastrar"> </LoginButton>
            <LoginButton textoLoginButton="Entrar"> </LoginButton>
          </div>

        </div>

      </div>
      <Rodape></Rodape>

      <AddEventButton></AddEventButton>
      <HomeButton></HomeButton>
      <PriorityButton PriorityText="Prioridade baixa"></PriorityButton>
      <Desciption></Desciption>
    
    </div>



    )
  }


export default Create
