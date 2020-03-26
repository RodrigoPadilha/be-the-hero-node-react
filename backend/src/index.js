const cors = require('cors')    // Módulo de segurança, define quem poderá acessar a aplicação
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(cors())     // Todas as aplicações poderão acessar a nossa PI
/*
    app.use(cors(
        origin:'http://meu_app.com'       // Quais endereços poderão acessar a nossa aplicação?
    ))
*/
app.use(express.json());
app.use(routes);

app.listen(3333);