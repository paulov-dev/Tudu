const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:5174' }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.listen(7274, () => {
    console.log('Servidor rodando na porta 7274');
});



// // Importa as dependências
// const express = require('express');
// const cors = require('cors');  // Importa o pacote CORS

// const app = express(); // Cria a instância do Express

// // Configura o CORS para permitir requisições do front-end
// app.use(cors({
//   origin: 'http://localhost:5173',  // Permite o front-end que está rodando no localhost:5173
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permite os métodos necessários
//   allowedHeaders: ['Content-Type', 'Authorization']  // Permite cabeçalhos específicos
// }));

// // Exemplo de rota POST
// app.post('/api/Tarefa', (req, res) => {
//   res.json({ message: 'Tarefa recebida com sucesso!' });
// });

// // Inicia o servidor
// const port = 7274;  // Porta que o servidor irá rodar
// app.listen(port, () => {
//   console.log(`Servidor rodando em http://localhost:${port}`);
// });

// module.exports = app;  // Exporta a instância do Express caso precise importar em outro arquivo
