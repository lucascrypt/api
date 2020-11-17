const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('./models/home');
const Home = mongoose.model('Home');

require('./models/contato');
const Contato = mongoose.model('Contato');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
    res.header("Access-Control-Allow-Headers", 'X-PINGOTHER, Content-Type, Authorization')
    app.use(cors());
    next();
});

mongoose.connect('mongodb://localhost/projeto', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão com o BD MongoDB realizado com sucesso!");
}).catch((err) => {
    console.log("Erro: Conexão com o BD MongoDB não realizado com sucesso: " + err);
});

app.get('/', (req, res) => {
    res.json({ name: "Lucas" });
});

app.get('/home', async (req, res) => {
    await Home.findOne({}).then((home) => {
        return res.json({
            error: false,
            home
        });
    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: "Nenhum resgistro encontrado!"
        });
    });
});

app.post('/home', async (req, res) => {

    const dados = {
        "topTitulo": "Temos a solução que a sua empresa precisa!",
        "topSubtitulo": "Faça um orçamento.",
        "topTextoBtn": "ENTRE EM CONTATO",
        "topLinkBtn": "http://localhost:3000/",
    }

    const homeExiste = await Home.findOne({});
    if (homeExiste) {
        return res.status(400).json({
            error: true,
            message: "Erro: A página home já possui um registro!"
        });
    }

    await Home.create(dados, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Erro: Conteúdo da página home não cadastrado com sucesso!"
        });
    });

    return res.json({
        error: false,
        message: "Conteúdo da página home cadastrado com sucesso!"
    })
});

app.post('/contato', async (req, res) => {
    await Contato.create(req.body, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Erro: Mensagem de contato não cadastrada com sucesso!"
        });
    });

    return res.json({
        error: false,
        message: "Mensagem de contato cadastrada com sucesso!"
    });
});

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000: http://localhost:3000");
});