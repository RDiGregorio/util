import {WebSocketServer} from 'ws';
import {MessageConnection} from './message-connection.js';

//TODO: some of the onclose/onerror stuff can be moved to the message connection
/**
 * A server that can send and receive messages.
 */

export class MessageServer {
    #onConnection = [];
    #replacer;
    #reviver;
    #webSocketServer;
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
        this.#webSocketServer = new WebSocketServer({server});

        this.#webSocketServer.on('connection', (webSocket, request) => {
            const messageConnection = new MessageConnection({
                ip: request.socket.remoteAddress,

                // todo: what if send or onMessage throw errors?

                send: message => webSocket.send(JSON.stringify(message, this.#replacer)),
                close: webSocket.close,
                onClose: callback => webSocket.on('close', callback),
                onMessage: callback => webSocket.on('message', message => callback(JSON.parse(message, this.#reviver)))
            });

            // todo: what about on connection errors?

            this.#onConnection.forEach(callback => callback(messageConnection));
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
     * Handles server errors.
     * @param {function(error: Error): void} callback
     */

    onError(callback) {
        this.#webSocketServer.on('error', error => callback(error));
        this.#webSocketServer.on('wsClientError', error => callback(error));
    }
}