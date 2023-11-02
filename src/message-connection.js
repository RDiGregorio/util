/**
 * A connection between a `MessageServer` and a `MessageClient`.
 */

export class MessageConnection {
    #close;
    #ip;
    #onClose;
    #onMessage;
    #send;

    /**
     * Creates a new `MessageConnection`.
     * @param {string} ip
     * @param {function(message: any): void} send
     * @param {function(): void} close
     * @param {function(function(): void): void} onClose
     * @param {function(function(message: any): void): void} onMessage
     */

    constructor({ip, send, close, onClose, onMessage}) {
        this.#ip = ip;
        this.#send = send;
        this.#close = close;
        this.#onClose = onClose;
        this.#onMessage = onMessage;
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
     * Handles a closed connection.
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
     * Sends a message from the server to the client.
     * @param {any} message
     */

    send(message) {
        this.#send(message);
    }
}