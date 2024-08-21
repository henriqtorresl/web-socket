import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Socket -> É um destino pra um fluxo de dados...
// WebSocket -> Comunicação bidirecional...

class App {

    private app: Application;
    private http: http.Server;
    private io: Server;

    constructor() {
        // Criando o meu servidor com o http e com o express:
        this.app = express();
        this.http = http.createServer(this.app);
        // Serviço de web socket:
        this.io = new Server(this.http);

        this.listenServer();
        this.listenSocket();
        this.setupRoutes();
    }

    // Inicializando o meu servidor http
    listenServer() {
        this.http.listen(3000, () => {
            console.log('Server is running!');
        });
    }

    // Inicializando o meu servidor de socket (Comunicação bidirecional...)
    listenSocket() {
        // O primeiro paremetro é um evento
        this.io.on('connection', (socket) => {
            console.log('user connected =>', socket.id);

            // Posso colocar o nome que eu quiser nesse evento, aqui chamei de 'message'
            socket.on('message', (msg) => {
                // Emitir o evento...
                this.io.emit('message', msg);
            });
        });
    }

    // Configurando meu index.html pra aparecer na rota raiz da aplicação
    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(`${__dirname}/index.html`);
        })
    }

}

const app = new App();