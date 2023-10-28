import _ from 'lodash';
import {WebSocketServer} from 'ws';
import {createPromise} from './async.js';

/**
 * A server that can send and receive messages.
 */

class MessageServer {
    #onClose;
    #onConnection;
    #onError;
    #onMessage;
    #server;

    constructor(server) {
        this.#server = server;
    }

    static #validateFunction(key, callback) {
        if (!_.isFunction(callback)) throw new Error(`invalid function: ${key}`);
    }

    connect() {
        const [promise, resolve] = createPromise();
        this.#server = new WebSocketServer({server: this.#server});
        this.#server.on('error', error => this.#onError(error));
        this.#server.on('wsClientError', error => this.#onError(error));
        this.#server.on('listening', () => resolve());
        this.#server.on('close', () => resolve());

        this.#server.on('connection', (socket, request) => {
            socket.on('error', error => this.#onError(error));

            try {
                const array = this.#onConnection(socket, request);
                socket.on('close', () => this.#onClose(...array));
                socket.on('message', message => this.#onMessage(message, ...array));
            } catch (error) {
                this.#onError(error);
            }
        });

        return promise;
    }

    /**
     * Closes the connection.
     */

    close() {
        this.#server.close();
    }

    onClose(callback) {
        this.#onClose = callback;
    }

    onConnection(callback) {
        this.#onConnection = callback;
    }

    onError(callback) {
        this.#onError = callback;
    }

    onMessage(callback) {
        this.#onMessage = callback;
    }
}