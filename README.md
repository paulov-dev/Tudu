# Tudu - Gerenciador de Tarefas

- **Tudu** o que você precisa!

## 📌 Visão Geral

O **Tudu** é um aplicativo de gerenciamento de tarefas que permite aos usuários criar, organizar e priorizar suas atividades. A aplicação contará com funcionalidades básicas como criação de contas, categorização de tarefas e definição de prazos e prioridades.

## ✅ Checklist de Requisitos

### **1. Requisitos Funcionais**

#### **1.1. Autenticação e Usuários**
- Implementação de cadastro e login de usuários com e-mail e senha.
- Suporte à autenticação baseada em **JWT** para garantir a segurança e a integridade das sessões de usuário.
- Funcionalidade de recuperação de senha, com envio de link de redefinição via e-mail.

#### **1.2. Gerenciamento de Categorias**
- Possibilidade de criar, editar e excluir categorias de tarefas.
- Usuários poderão organizar suas tarefas em diferentes categorias para uma gestão mais eficiente.
- Capacidade de atribuir tarefas a múltiplas categorias, se necessário.

#### **1.3. Gerenciamento de Tarefas**
- Criação, edição e exclusão de tarefas, permitindo que o usuário personalize seus itens de acordo com suas necessidades.
- Cada tarefa poderá ser associada a um prazo e prioridade, para ajudar o usuário a organizar seu trabalho de forma mais eficaz.
- Tarefas poderão ser marcadas como concluídas, com possibilidade de visualização de progresso.
- Funcionalidade de arrastar e soltar para reorganizar tarefas e definir prioridades.

#### **1.4. Interface e Experiência do Usuário**
- Interface simples, intuitiva e responsiva, com um design limpo e moderno, que se adapta a diferentes tamanhos de tela.
- Visualização das tarefas de forma clara, com filtros para facilitar a navegação por categorias, prazos e prioridades.
- Suporte a múltiplas plataformas (desktop e mobile), proporcionando uma experiência consistente em todos os dispositivos.
- Feedback visual, como animações ou mudanças de cor, para indicar a mudança de status das tarefas e a conclusão de etapas.

#### **1.5. Notificações (Futuro - Extra)**
- Notificações push e por e-mail para lembrar o usuário sobre prazos e tarefas pendentes.
- Alertas de tarefas próximas do vencimento, com possibilidade de configurar preferências de notificação.

---

### **2. Requisitos Não Funcionais**

#### **2.1. Performance e Escalabilidade**
- Estrutura de dados otimizada para realizar operações como busca e filtragem de tarefas de maneira eficiente.

#### **2.2. Segurança**
- Implementação de autenticação segura com **JWT** e armazenamento seguro de senhas usando **bcrypt**.
- Comunicação entre o cliente e o servidor deve ser feita por meio de HTTPS para garantir a proteção dos dados.

---

### **3. Tecnologias Utilizadas**

- **Frontend:** React.js
- **Backend:** Node.js com Typescript (Express ou Fastify) **ou** C# (ASP.NET Web API)
    Plataforma poderosa e escalável para APIs, com alto desempenho e segurança. Integração fácil com o ecossistema Microsoft e ferramentas como Visual Studio. Ideal para aplicações corporativas e ambientes       Windows.
- **Banco de Dados:** SQL Server
    Biblioteca para UIs dinâmicas e interativas, com componentização e Virtual DOM para alta performance. Fácil integração com APIs RESTful, permitindo interfaces modernas e eficientes.
- **Autenticação:** JWT
- **Estilização:** Material-UI ou TailwindCSS

---
