import WebSocket from 'ws';

/**
 * A client that can send and receive messages.
 */

class MessageClient {
    #socket;

    /**
     * Creates a new `MessageClient`.
     * @param {string} host
     * @param {number} port
     * @param {boolean} secure
     */

    constructor(host, port, secure = false) {
        this.#socket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
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
     * Handles "open" events.
     * @param callback
     */

    onOpen(callback) {
        this.#socket.on('open', () => callback());
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
     */

    send(message) {
        this.#socket.send(message);
    }
}