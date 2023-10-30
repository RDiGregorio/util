import {WebSocketServer} from 'ws';

/**
 * A server that can send and receive messages.
 */

export class MessageServer {
    #onClose;
    #onError;
    #onMessage;
    #replacer;
    #reviver;
    #server;
    #webSocketServer;

    /**
     * Creates a new `MessageServer` from an HTTP or HTTPS server.
     * @param {any} server
     * @param {function(key: number|string, value: any): any} [replacer]
     * @param {function(key: number|string, value: any): any} [reviver]
     */

    constructor({server, replacer, reviver}) {
        this.#server = server;
        this.#webSocketServer = new WebSocketServer({server: server});
        this.#replacer = replacer;
        this.#reviver = reviver;
    }

    /**
     * Stops listening for new connections and closes all existing connections.
     */

    close() {
        this.#server.close();
    }

    /**
     * Listens for new connections.
     * @param {function(state: any, send: function(message: any): void, request: any): void} callback
     * @param {number} [port = 8080]
     */

    listen(callback, port = 8080) {
        function rethrow(error) {
            throw error;
        }

        this.#webSocketServer.on('error', error => (this.#onError ?? rethrow)(error));
        this.#webSocketServer.on('wsClientError', error => (this.#onError ?? rethrow)(error));

        this.#webSocketServer.on('connection', (webSocket, request) => {
            webSocket.on('error', error => (this.#onError ?? rethrow)(error));

            const send = message => {
                webSocket.send(JSON.stringify(message, this.#replacer));
            }

            try {
                const state = {};
                callback(state, send, request);
                webSocket.on('close', () => (this.#onClose ?? (() => undefined))(state));

                webSocket.on('message', message =>
                    (this.#onMessage ?? (() => undefined))(state, send, JSON.parse(message, this.#reviver))
                );

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
     * @param {function(state: any, send: function(message: any): void, message: any): void} callback
     */

    onMessage(callback) {
        // todo: allow multiple listeners
        this.#onMessage = callback;
    }
}