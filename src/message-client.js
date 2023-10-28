import WebSocket from 'ws';
import {createPromise} from "./async.js";

/**
 * A client that can send and receive messages.
 */

export class MessageClient {
    #promise;
    #socket;

    /**
     * Creates a new `MessageClient`.
     * @param {string} host
     * @param {number} port
     * @param {boolean} secure
     */

    constructor(host, port, secure = false) {
        this.#socket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
        const [promise, resolve] = createPromise();
        this.#promise = promise;
        this.#socket.on('open', resolve);
    }

    /**
     * Closes the connection.
     */

    close() {
        this.#socket.close();
    }

    /**
     * Handles "close" events.
     * @param {function(): void} callback
     */

    onClose(callback) {
        this.#socket.on('close', () => callback);
    }

    /**
     * Handles "error" events.
     * @param {function(error: any): void} callback
     */

    onError(callback) {
        this.#socket.on('error', error => callback(error));
    }

    /**
     * Handles "message" events.
     * @param {function(message: any): void} callback
     */

    onMessage(callback) {
        this.#socket.on('message', message => callback(message));
    }

    /**
     * @param {string} message
     * @return {Promise<void>}
     */

    async send(message) {
        await this.#promise;
        this.#socket.send(message);
    }
}