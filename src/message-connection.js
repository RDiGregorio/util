/**
 * A connection between a `MessageServer` and a `MessageClient`.
 */

export class MessageConnection {
    #close;
    #ip;
    #onClose;
    #onError;
    #onMessage;
    #send;

    /**
     * Creates a new `MessageConnection`.
     * @param {string} ip
     * @param {function(message: any): void} send
     * @param {function(): void} close
     * @param {function(function(): void): void} onClose
     * @param {function(function(message: any): void): void} onMessage
     * @param {function(function(error: Error): void): void} onError
     */

    constructor({ip, send, close, onClose, onMessage, onError}) {
        this.#ip = ip;
        this.#send = send;
        this.#close = close;
        this.#onClose = onClose;
        this.#onMessage = onMessage;
        this.#onError = onError;
    }

    /**
     * Returns the ip address of the client.
     * @return {string}
     */

    get ip() {
        return this.#ip;
    }

    /**
     * Closes the connection.
     */

    close() {
        this.#close();
    }

    /**
     * Handles a closed connection. TODO: remove this, instead use the promise
     * @param {function(): void} callback
     */

    onClose(callback) {
        this.#onClose(callback);
    }

    /**
     * Receives a message.
     * @param {function(message: any): void} callback
     */

    onMessage(callback) {
        this.#onMessage(callback);
    }

    /**
     * Handles errors from the connection.
     * @param {function(error: Error): void} callback
     */

    onError(callback) {
        this.#onError(callback);
    }

    /**
     * Sends a message from the server to the client.
     * @param {any} message
     */

    send(message) {
        this.#send(message);
    }
}