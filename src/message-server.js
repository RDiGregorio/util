import {WebSocketServer} from 'ws';
import {MessageConnection} from './message-connection.js';
import {createPromise} from "./async.js";

/**
 * A server that can send and receive messages.
 */

export class MessageServer {
    #onConnection = [];
    #replacer;
    #reviver;
    #webSocketServer;
    #whenClosed;
    #whenOpened;
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
        const [openPromise, openResolve] = createPromise();
        server.on('listening', () => openResolve());
        this.#whenOpened = openPromise;
        const [closePromise, closeResolve] = createPromise();
        server.on('close', () => closeResolve());
        this.#whenClosed = closePromise;

        this.#webSocketServer.on('connection', (webSocket, request) => {
            function attempt(callback) {
                try {
                    callback();
                } catch (error) {
                    webSocket.emit('error', error);
                }
            }

            const messageConnection = new MessageConnection({
                ip: request.socket.remoteAddress,
                send: message => attempt(() => webSocket.send(JSON.stringify(message, this.#replacer))),
                close: webSocket.close,
                onClose: callback => webSocket.on('close', () => attempt(callback)),
                onMessage: callback => webSocket.on('message', message => attempt(() =>
                    callback(JSON.parse(message, this.#reviver))
                )),
                onError: callback => webSocket.on('error', error => callback(error))
            });

            this.#onConnection.forEach(callback => attempt(() => callback(messageConnection)));
        });

        this.#server.listen(port);
    }

    /**
     * Resolves when the server is closed.
     * @return {Promise<void>}
     */

    get whenClosed() {
        return this.#whenClosed;
    }

    /**
     * Resolves when the server starts listening for connections.
     * @return {Promise<void>}
     */

    get whenOpened() {
        return this.#whenOpened;
    }

    /**
     * Stops listening for new connections and closes all existing connections.
     */

    close() {
        this.#server.close();
    }

    /**
     * Handles a closed server. TODO: remove this, instead use the promise
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
     * Handles errors from the server.
     * @param {function(error: Error): void} callback
     */

    onError(callback) {
        this.#webSocketServer.on('error', error => callback(error));
        this.#webSocketServer.on('wsClientError', error => callback(error));
    }
}