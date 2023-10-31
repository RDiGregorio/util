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
        let count = 0;

        const handleError = (error, connectionInfo) => {
            if (this.#onError.length === 0) throw error;
            this.#onError.forEach(callback => callback(error, connectionInfo));
        }

        const webSocketServer = new WebSocketServer({server});
        webSocketServer.on('error', error => handleError(error));
        webSocketServer.on('wsClientError', error => handleError(error));

        webSocketServer.on('connection', (webSocket, request) => {
            const connectionInfo = {id: count++, ip: request.socket.remoteAddress};

            webSocket.on('error', handleError);
            const send = message => void webSocket.send(JSON.stringify(message, this.#replacer));

            try {
                this.#onConnection.forEach(callback => callback(send, connectionInfo));
                webSocket.on('close', () => this.#onClose.forEach(callback => callback(connectionInfo)));

                webSocket.on('message', message => this.#onMessage.forEach(callback =>
                    callback(JSON.parse(message, this.#reviver), send, connectionInfo)
                ));
            } catch (error) {
                handleError(error, connectionInfo);
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
     * @param {function(connectionInfo: {id: number, ip: string}): void} callback
     */

    onClose(callback) {
        this.#onClose.push(callback);
    }

    /**
     * Handles a new connection.
     * @param {function(send: function(message: any): void, connectionInfo: {id: number, ip: string}): void} [callback]
     */

    onConnection(callback) {
        this.#onConnection.push(callback);
    }

    /**
     * Handles errors.
     * @param {function(error: any, connectionInfo?: {id: number, ip: string}): void} callback
     */

    onError(callback) {
        this.#onError.push(callback);
    }

    /**
     * Receives a message.
     * @param {
     *     function(message: any, send: function(message: any): void, connectionInfo: {id: number, ip: string}): void
     * } callback
     */

    onMessage(callback) {
        this.#onMessage.push(callback);
    }
}