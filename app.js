import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import methodOverride from 'method-override';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Configurações do servidor e do banco de dados
const app = express();
const port = 3000;
const url = "mongodb://localhost:27017/";
const dbName = 'amazonaverde';
const produtosCollection = 'produtos';
const usuariosCollection = 'usuarios';
const API_KEY = "AIzaSyBxH1olaIQVJGDPx5uSW2MJggB1To6Rm5E";

// Middleware
app.use(methodOverride('_method'));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'segredo-super-seguro',
    resave: false,
    saveUninitialized: true
}));

// Configuração do motor de visualização EJS
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Funções auxiliares
async function connectToDB() {
    const client = new MongoClient(url);
    await client.connect();
    return client.db(dbName);
}

function protegerRota(req, res, next) {
    if (req.session.usuario) {
        next();
    } else {
        res.redirect('/bemvindo');
    }
}

// Rotas de páginas estáticas
app.get('/', (req, res) => res.sendFile(path.join(process.cwd(), 'homepage.html')));
app.get('/index', (req, res) => res.sendFile(path.join(process.cwd(), 'index.html')));
app.get('/planos', (req, res) => res.sendFile(path.join(process.cwd(), 'planos.html')));
app.get('/cadastro', (req, res) => res.sendFile(path.join(process.cwd(), 'views/cadastro.html')));
app.get('/alterar-usuario', protegerRota, (req, res) => res.render('alterarUsuario', { usuario: req.session.usuario }));
app.get('/bemvindo', protegerRota, (req, res) => res.render('welcome', { usuario: req.session.usuario }));
app.get('/chat', (req, res) => res.sendFile(path.join(process.cwd(), 'chat.html')));


app.get('/chat', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'chat.html'));
});

// Rota para carregar a página de atualização
app.get('/atualizar', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'atualizar.html'));
});

// Rota para oncaPintada
app.get('/oncaPintada', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'oncaPintada.html'));
});

// Rota para ararajuba
app.get('/ararajuba', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'ararajuba.html'));
});

// Rota para ariranha
app.get('/ariranha', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'ariranha.html'));
});

// Rota para cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views/cadastro.html'));
});

// Rota de boas-vindas
app.get('/bemvindo', protegerRota, (req, res) => {
    console.log('Usuário logado:', req.session.usuario);
    res.sendFile(path.join(process.cwd(), 'views/welcome.html'));
});

// Outras rotas
app.get('/botoCorDeRosa', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'botoCorDeRosa.html'));
});

app.get('/GatoMaracaja', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'GatoMaracaja.html'));
});

app.get('/gaviaoReal', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'gaviaoReal.html'));
});

app.get('/macacoAranha', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'macacoAranha.html'));
});

app.get('/macacoPrego', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'macacoPrego.html'));
});

app.get('/oncaParda', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'oncaParda.html'));
});

app.get('/peixeBoi', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'peixeBoi.html'));
});

app.get('/sauimDeColeira', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'sauimDeColeira.html'));
});

app.get('/macacoprego', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/macacoPrego.html'));
});

app.get('/uacari', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'uacari.html'));
});

app.get('/updateDados', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'updateDados.html'));
});

app.get('/planos', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'planos.html'));
});
// Rotas de páginas de animais


// Rotas para funcionalidades de usuário
app.get('/perfil', protegerRota, (req, res) => {
    // Verifica se a query string contém o parâmetro 'plano' e armazena na sessão
    const planoEscolhido = req.query.plano;

    if (planoEscolhido) {
        req.session.planoEscolhido = planoEscolhido;  // Armazena na sessão
    }

    // Passa a informação para o perfil.ejs
    res.render('perfil', { 
        usuario: req.session.usuario, 
        plano: req.session.planoEscolhido  // Passa a variável 'plano' para o EJS
    });
});


app.post('/cadastro', async (req, res) => {
    const usuario = req.body;
    const db = await connectToDB();
    const collection = db.collection(usuariosCollection);

    try {
        const usuarioExistente = await collection.findOne({ usuario: usuario.usuario });
        if (usuarioExistente) {
            return res.status(400).send('Usuário já existe! Tente outro nome de usuário.');
        }
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
        await collection.insertOne(usuario);
        req.session.usuario = usuario.usuario;
        res.redirect('/perfil');
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).send('Erro ao registrar usuário. Por favor, tente novamente mais tarde.');
    }
});

app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
    const db = await connectToDB();
    const collection = db.collection(usuariosCollection);

    try {
        const usuarioEncontrado = await collection.findOne({ usuario });
        if (usuarioEncontrado && await bcrypt.compare(senha, usuarioEncontrado.senha)) {
            req.session.usuario = usuario;
            res.redirect('/perfil');
        } else {
            res.redirect('/erro');
        }
    } catch (err) {
        console.error('Erro ao realizar login:', err);
        res.status(500).send('Erro ao realizar login. Por favor, tente novamente mais tarde.');
    }
});

app.post('/alterar-usuario', protegerRota, async (req, res) => {
    const { novoUsuario, novaSenha } = req.body;
    const db = await connectToDB();
    const collection = db.collection(usuariosCollection);
    const usuarioAtual = req.session.usuario;

    try {
        const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
        await collection.updateOne(
            { usuario: usuarioAtual },
            { $set: { usuario: novoUsuario, senha: senhaCriptografada } }
        );
        req.session.usuario = novoUsuario;
        res.redirect('/perfil');
    } catch (err) {
        console.error('Erro ao atualizar dados do usuário:', err);
        res.status(500).send('Erro ao atualizar dados. Tente novamente mais tarde.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/erro');
        res.redirect('/');
    });
});

// Configuração da IA Generativa
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};
const SAFETY_SETTING = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

app.post('/chat', async (req, res) => {
    const userInput = req.body.userInput;

    // Defina as palavras-chave ou frases-chave que o bot deve aceitar
    const allowedTopics = [
        "sustentabilidade", 
        "extinção de animais", 
        "meio ambiente", 
        "conservação de animais", 
        "fauna", 
        "flora", 
        "mudanças climáticas", 
        "preservação ambiental"
    ];

    // Função para verificar se o input contém palavras-chave válidas
    function isRelevantInput(input) {
        return allowedTopics.some(topic => input.toLowerCase().includes(topic));
    }

    try {
        // Se a entrada não for relevante, retorne uma mensagem padrão
        if (!isRelevantInput(userInput)) {
            return res.json({
                response: "Desculpe, eu só posso conversar sobre sustentabilidade e extinção de animais. Por favor, faça perguntas sobre esses temas."
            });
        }

        // Agora, crie o chat com a IA e envie a mensagem
        const chat = model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTING,
            history: [],
        });

        const result = await chat.sendMessage(userInput);

        // Verifique se a resposta gerada está dentro do tema desejado
        const responseText = result.response.text();

        // Se a resposta não estiver dentro dos tópicos permitidos, ajuste
        if (!isRelevantInput(responseText)) {
            return res.json({
                response: "Desculpe, não posso responder a isso. Só posso falar sobre sustentabilidade e extinção de animais."
            });
        }

        // Caso contrário, envie a resposta gerada pela IA
        res.json({ response: responseText });

    } catch (error) {
        console.error('Erro no chat:', error.message);
        res.status(500).json({ error: 'Erro ao processar a mensagem do chat.' });
    }
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});
