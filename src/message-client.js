import WebSocket from 'ws';
import {createPromise} from './async.js';

/**
 * A client that can send and receive messages.
 */

export class MessageClient {
    #promise;
    #webSocket;

    /**
     * Creates a new `MessageClient`.
     * @param {string} [host = "localhost"]
     * @param {number} [port = 8080]
     * @param {boolean} [secure = false]
     */

    constructor(host = 'localhost', port = 8080, secure = false) {
        this.#webSocket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
        const [promise, resolve] = createPromise();
        this.#promise = promise;
        this.#webSocket.on('open', resolve);
    }

    /**
     * Closes the connection.
     */

    close() {
        this.#webSocket.close();
    }

    /**
     * Handles "close" events.
     * @param {function(): void} callback
     */

    onClose(callback) {
        this.#webSocket.on('close', () => callback);
    }

    /**
     * Handles "error" events.
     * @param {function(error: any): void} callback
     */

    onError(callback) {
        this.#webSocket.on('error', error => callback(error));
    }

    /**
     * Handles "message" events.
     * @param {function(message: any): void} callback
     */

    onMessage(callback) {
        this.#webSocket.on('message', message => callback(`${message}`));
    }

    /**
     * @param {string} message
     * @return {Promise<void>}
     */

    async send(message) {
        await this.#promise;
        this.#webSocket.send(message);
    }
}