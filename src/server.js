import _ from 'lodash';
import {WebSocketServer} from 'ws';
import {createPromise} from './async.js';

// todo: handle on close?

class Server {
    #onConnect;
    #onError;
    #onMessage;
    #server;

    constructor(server) {
        this.#server = server;
    }

    static #validateFunction(callback) {
        if (!_.isFunction(callback)) throw new Error(`invalid function: ${callback}`);
    }

    connect(port = 8080) {
        Server.#validateFunction(this.#onConnect);
        Server.#validateFunction(this.#onError);
        Server.#validateFunction(this.#onMessage);
        const [promise, resolve] = createPromise();
        this.#server = new WebSocketServer({port: port});
        this.#server.on('error', this.#onError);
        this.#server.on('wsClientError', this.#onError);
        this.#server.on('listening', () => resolve());
        this.#server.on('close', () => resolve());

        this.#server.on('connection', (socket, request) => {
            socket.on('error', this.#onError);

            try {
                const array = this.#onConnect(socket, request);
                socket.on('message', message => this.#onMessage(message, ...array));
            } catch (error) {
                this.#onError(error);
            }
        });

        return promise;
    }

    close() {
        this.#server.close();
    }


    onClose() {

    }

    onConnect(callback) {
        Server.#validateFunction(callback);
        this.#onConnect = callback;
    }

    onError(callback) {
        Server.#validateFunction(callback);
        this.#onError = callback;
    }

    onSocketMessage(callback) {
        Server.#validateFunction(callback);
        this.#onMessage = callback;
    }

    onSocketClose() {

    }
}