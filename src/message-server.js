import {WebSocketServer} from 'ws';

/**
 * A server that can send and receive messages.
 */

export class MessageServer {
    #onClose = [];
    #onConnection = [];
    #onError = [];
    #onMessage = [];
    #replacer;
    #reviver;
    #server;

    /**
     * Creates a new `MessageServer` from a `Server`.
     * @param {Server} server
     * @param {number} [port = 8080]
     * @param {function(key: number|string, value: any): any} [replacer]
     * @param {function(key: number|string, value: any): any} [reviver]
     */

    constructor({server, port = 8080, replacer, reviver}) {
        this.#server = server;
        this.#replacer = replacer;
        this.#reviver = reviver;

        const handleError = (error) => {
            if (this.#onError.length === 0) throw error;
            this.#onError.forEach(callback => callback(error));
        }

        const webSocketServer = new WebSocketServer({server});
        webSocketServer.on('error', handleError);
        webSocketServer.on('wsClientError', handleError);

        webSocketServer.on('connection', (webSocket, request) => {
            webSocket.on('error', handleError);
            const send = message => void webSocket.send(JSON.stringify(message, this.#replacer))

            try {
                this.#onConnection.forEach(callback => callback(send, request));
                webSocket.on('close', () => this.#onClose.forEach(callback => callback()));

                webSocket.on('message', message =>
                    this.#onMessage.forEach(callback => callback(send, JSON.parse(message, this.#reviver)))
                );
            } catch (error) {
                handleError(error);
            }
        });

        this.#server.listen(port);
    }

    /**
     * Stops listening for new connections and closes all existing connections.
     */

    close() {
        this.#server.close();
    }

    /**
     * Handles a closed connection.
     * @param {function(): void} callback
     */

    onClose(callback) {
        this.#onClose.push(callback);
    }

    /**
     * Handles a new connection.
     * @param {function(send: function(message: any): void, request: IncomingMessage): void} [callback]
     */

    onConnection(callback) {
        this.#onConnection.push(callback);
    }

    /**
     * Handles errors.
     * @param {function(error: any): void} callback
     */

    onError(callback) {
        this.#onError.push(callback);
    }

    /**
     * Receives a message.
     * @param {function(send: function(message: any): void, message: any): void} callback
     */

    onMessage(callback) {
        this.#onMessage.push(callback);
    }
}