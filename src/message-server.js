import {WebSocketServer} from 'ws';
import {createPromise} from './async.js';

/**
 * A server that can send and receive messages.
 */

class MessageServer {
    #onClose;
    #onError;
    #onMessage;
    #onConnection;
    #port;
    #server;

    /**
     * Creates a new `MessageServer`.
     * @param {any} server
     * @param {number} port
     */

    constructor(server, port) {
        this.#server = server;
        this.#port = port;
    }

    connect() {
        function rethrow(error) {
            throw error;
        }

        const [promise, resolve] = createPromise();
        this.#server = new WebSocketServer({server: this.#server});
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

        this.#server.listen(this.#port);
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
     * Handles "message" events.
     * @param {function(message: any, state: any): void} callback
     */

    onMessage(callback) {
        this.#onMessage = callback;
    }
}