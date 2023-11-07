import WebSocket from 'ws';
import {createPromise} from './async.js';

/**
 * A client that can send and receive messages.
 */

export class MessageClient {
    #webSocket;
    #whenClosed;
    #whenOpened;
    #replacer;
    #reviver;

    /**
     * Creates a new `MessageClient`.
     * @param {string} [host = "localhost"]
     * @param {number} [port = 8080]
     * @param {boolean} [secure = false]
     * @param {function(key: number|string, value: any): any} [replacer]
     * @param {function(key: number|string, value: any): any} [reviver]
     */

    constructor({host = 'localhost', port = 8080, secure = false, replacer, reviver}) {
        this.#webSocket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
        const [openPromise, openResolve] = createPromise();
        this.#webSocket.on('open', () => openResolve());
        this.#whenOpened = openPromise;
        const [closePromise, closeResolve] = createPromise();
        this.#webSocket.on('close', () => closeResolve());
        this.#whenClosed = closePromise;
        this.#replacer = replacer;
        this.#reviver = reviver;
    }

    /**
     * Resolves when the connection is closed.
     * @return {Promise<void>}
     */

    get whenClosed() {
        return this.#whenClosed;
    }

    /**
     * Resolves when the connection is opened.
     * @return {Promise<void>}
     */

    get whenOpened() {
        return this.#whenOpened;
    }

    /**
     * Closes the connection.
     */

    close() {
        this.#webSocket.close();
    }

    /**
     * Handles a closed connection. TODO: remove this, instead use the promise
     * @param {function(): void} callback
     */

    onClose(callback) {
        this.#webSocket.on('close', () => callback);
    }

    /**
     * Handles errors.
     * @param {function(error: Error): void} callback
     */

    onError(callback) {
        this.#webSocket.on('error', error => callback(error));
    }

    /**
     * Receives a message.
     * @param {function(message: any): void} callback
     */

    onMessage(callback) {
        this.#webSocket.on('message', message => callback(JSON.parse(message, this.#reviver)));
    }

    /**
     * Sends a message.
     * @param {any} message
     */

    send(message) {
        this.#whenOpened.then(() => this.#webSocket.send(JSON.stringify(message, this.#replacer)));
    }
}