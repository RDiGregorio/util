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
    #close;

    /**
     * Creates a new `MessageServer` from an HTTP or HTTPS server.
     * @param {any} server
     */

    constructor(server) {
        this.#server = new WebSocketServer({server: server});
        this.#close = server.close;
    }

    /**
     * Stops listening for new connections and closes all existing connections.
     */

    close() {
        this.#close();
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

        const [promise, resolve] = createPromise();
        this.#server.on('error', error => (this.#onError ?? rethrow)(error));
        this.#server.on('wsClientError', error => (this.#onError ?? rethrow)(error));
        this.#server.on('listening', () => resolve());
        this.#server.on('close', () => resolve());

        this.#server.on('connection', (socket, request) => {
            socket.on('error', error => (this.#onError ?? rethrow)(error));

            try {
                const state = this.#onConnection?.call(socket, request);
                socket.on('close', () => this.#onClose?.call(state));
                socket.on('message', message => this.#onMessage?.call(message, state));
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