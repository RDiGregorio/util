import {WebSocketServer} from 'ws';
import {MessageConnection} from './message-connection.js';

//TODO: some of the onclose/onerror stuff can be moved to the message connection
/**
 * A server that can send and receive messages.
 */

export class MessageServer {
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
        webSocketServer.on('error', error => handleError(error));
        webSocketServer.on('wsClientError', error => handleError(error));

        webSocketServer.on('connection', (webSocket, request) => {
            webSocket.on('error', handleError);

            const messageConnection = new MessageConnection({
                ip: request.socket.remoteAddress,
                send: message => webSocket.send(JSON.stringify(message, this.#replacer)),
                close: webSocket.close,
                onClose: callback => webSocket.on('close', callback)
            });

            webSocket.on('message', message => this.#onMessage.forEach(callback =>
                callback(JSON.parse(message, this.#reviver), messageConnection)
            ));

            try {
                this.#onConnection.forEach(callback => callback(messageConnection));
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
     * Handles a closed server.
     * @param {function(): void} callback
     */

    onClose(callback) {
        this.#server.on('close', () => callback());
    }

    /**
     * Handles a new connection.
     * @param {function(messageConnection: MessageConnection): void} [callback]
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
     * Receives a message. TODO: move this to the connection
     * @param {
     *     function(message: any, messageConnection: MessageConnection): void
     * } callback
     */

    onMessage(callback) {
        this.#onMessage.push(callback);
    }
}