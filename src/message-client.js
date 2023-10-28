import WebSocket from 'ws';
import {createPromise} from './async.js';

/**
 * A client that can send and receive messages.
 */

export class MessageClient {
    #promise;
    #webSocket;
    #replacer;
    #reviver;

    /**
     * Creates a new `MessageClient`.
     * @param {string} host
     * @param {number} [port = 8080]
     * @param {boolean} [secure = false]
     * @param {function(key: number|string, value: any): any} [replacer]
     * @param {function(key: number|string, value: any): any} [reviver]
     */

    constructor({host, port = 8080, secure = false, replacer, reviver}) {
        this.#webSocket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
        const [promise, resolve] = createPromise();
        this.#promise = promise;
        this.#webSocket.on('open', resolve);
        this.#replacer = replacer;
        this.#reviver = reviver;
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
        this.#webSocket.on('message', message => callback(JSON.parse(message, this.#reviver)));
    }

    /**
     * @param {any} message
     * @return {Promise<void>}
     */

    async send(message) {
        await this.#promise;
        this.#webSocket.send(JSON.stringify(message, this.#replacer));
    }
}