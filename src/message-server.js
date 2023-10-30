import {WebSocketServer} from 'ws';

/**
 * A server that can send and receive messages.
 */

export class MessageServer {
    #onClose = [];
    #onError = [];
    #onMessage = [];
    #replacer;
    #reviver;
    #server;
    #webSocketServer;
    #port;

    /**
     * Creates a new `MessageServer` from an HTTP or HTTPS server.
     * @param {any} server
     * @param {number} [port = 8080]
     * @param {function(key: number|string, value: any): any} [replacer]
     * @param {function(key: number|string, value: any): any} [reviver]
     */

    constructor({server, port = 8080, replacer, reviver}) {
        this.#server = server;
        this.#port = port;
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
     * @param {function(state: any, send: function(message: any): void, request: any): void} [callback]
     */

    listen(callback) {
        const handleError = (error) => {
            if (this.#onError.length === 0) throw error;
            this.#onError.forEach(callback => callback(error));
        }

        this.#webSocketServer.on('error', handleError);
        this.#webSocketServer.on('wsClientError', handleError);

        this.#webSocketServer.on('connection', (webSocket, request) => {
            webSocket.on('error', handleError);
            const send = message => void webSocket.send(JSON.stringify(message, this.#replacer))

            try {
                const state = {};
                if (arguments.length >= 1) callback(state, send, request);
                webSocket.on('close', () => this.#onClose.forEach(callback => callback(state)));

                webSocket.on('message', message =>
                    this.#onMessage.forEach(callback => callback(state, send, JSON.parse(message, this.#reviver)))
                );

            } catch (error) {
                handleError(error);
            }
        });

        this.#server.listen(this.#port);
    }

    /**
     * Handles "close" events from connections.
     * @param {function(state: any): void} callback
     */

    onClose(callback) {
        this.#onClose.push(callback);
    }

    /**
     * Handles "error" events.
     * @param {function(error: any): void} callback
     */

    onError(callback) {
        this.#onError.push(callback);
    }

    /**
     * Handles "message" events from connections.
     * @param {function(state: any, send: function(message: any): void, message: any): void} callback
     */

    onMessage(callback) {
        this.#onMessage.push(callback);
    }
}