import _ from 'lodash';
import {WebSocketServer} from 'ws';
import {createPromise} from './async.js';

/**
 * A server that can send and receive messages.
 */

class MessageServer {
    #callback;
    #onClose;
    #onError;
    #onMessage;
    #server;

    /**
     * Creates a new `MessageServer`.
     * @param {any} server
     * @param {function(socket: any, request: any): any[]} callback
     */

    constructor(server, callback) {
        this.#server = server;
        this.#callback = callback;
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
                const array = this.#callback(socket, request);
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

    /**
     * Handles "close" events.
     * @param {function(...value: any): void} callback
     */

    onClose(callback) {
        this.#onClose = callback;
    }

    /**
     * Handles "error" events.
     * @param {function(error: any): void} callback
     */

    onError(callback) {
        this.#onError = callback;
    }

    /**
     * Handles "message" events.
     * @param {function(message: any, ...value: any): void} callback
     */

    onMessage(callback) {
        this.#onMessage = callback;
    }
}