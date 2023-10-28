import {WebSocketServer} from 'ws';
import {createPromise} from './async.js';

/**
 * A server that can send and receive messages.
 */

export class MessageServer {
    #onClose;
    #onError;
    #onMessage;
    #server;
    #webSocketServer;

    /**
     * Creates a new `MessageServer` from an HTTP or HTTPS server.
     * @param {any} server
     */

    constructor(server) {
        this.#server = server;
        this.#webSocketServer = new WebSocketServer({server: server});
    }

    /**
     * Stops listening for new connections and closes all existing connections.
     */

    close() {
        this.#server.close();
    }

    /**
     * Listens for new connections. The value returned by `callback` is passed to "close" and "message" event handlers.
     * @param {number} port
     * @param {function(socket: any, request: any): any} callback
     * @return {Promise}
     */

    listen(port, callback) {
        function rethrow(error) {
            throw error;
        }

        function ignore() {
        }

        this.#webSocketServer.on('error', error => (this.#onError ?? rethrow)(error));
        this.#webSocketServer.on('wsClientError', error => (this.#onError ?? rethrow)(error));

        this.#webSocketServer.on('connection', (socket, request) => {
            socket.on('error', error => (this.#onError ?? rethrow)(error));

            try {
                const state = callback(socket, request);
                socket.on('close', () => (this.#onClose ?? ignore)(state));
                socket.on('message', message => (this.#onMessage ?? ignore)(state, `${message}`));
            } catch (error) {
                (this.#onError ?? rethrow)(error);
            }
        });

        this.#server.listen(port);
    }

    /**
     * Handles "close" events from connections.
     * @param {function(state: any): void} callback
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
     * Handles "message" events from connections.
     * @param {function(state: any, message: any): void} callback
     */

    onMessage(callback) {
        this.#onMessage = callback;
    }
}