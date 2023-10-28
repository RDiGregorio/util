import {WebSocketServer} from 'ws';
import {createPromise} from './async.js';

/**
 * A server that can send and receive messages.
 */

export class MessageServer {
    #onClose;
    #onError;
    #onMessage;
    #onConnection;
    #server;
    #webSocketServer;
    #close;

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
     * Listens for new connections.
     * @param {number} port
     * @return {Promise}
     */

    listen(port) {
        function rethrow(error) {
            throw error;
        }

        function ignore() {
        }

        const [promise, resolve] = createPromise();
        this.#webSocketServer.on('error', error => (this.#onError ?? rethrow)(error));
        this.#webSocketServer.on('wsClientError', error => (this.#onError ?? rethrow)(error));
        this.#webSocketServer.on('listening', () => resolve());
        this.#webSocketServer.on('close', () => resolve());

        this.#webSocketServer.on('connection', (socket, request) => {
            socket.on('error', error => (this.#onError ?? rethrow)(error));

            try {
                const state = (this.#onConnection ?? ignore)(socket, request);
                socket.on('close', () => (this.#onClose ?? ignore)(state));
                socket.on('message', message => (this.#onMessage ?? ignore)(message, state));
            } catch (error) {
                (this.#onError ?? rethrow)(error);
            }
        });

        this.#server.listen(port);
        return promise;
    }

    /**
     * Handles "close" events from connections.
     * @param {function(state: any): void} callback
     */

    onClose(callback) {
        this.#onClose = callback;
    }

    /**
     * Handles "connection" events. Returns the state object used by "close" and "message" event handlers.
     * @param callback
     * @return {any}
     */

    onConnection(callback) {
        this.#onConnection = callback
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
     * @param {function(message: any, state: any): void} callback
     */

    onMessage(callback) {
        this.#onMessage = callback;
    }
}