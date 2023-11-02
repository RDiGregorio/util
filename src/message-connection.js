/**
 * A connection between a `MessageServer` and a `MessageClient`.
 */

export class MessageConnection {
    #close;
    #ip;
    #onClose;
    #send;

    /**
     * Creates a new `MessageConnection`.
     * @param {string} ip
     * @param {function(message: any): void} send
     * @param {function(): void} close
     * @param {function(function(): void): void} onClose
     */

    constructor({ip, send, close, onClose}) {
        this.#ip = ip;
        this.#send = send;
        this.#close = close;
        this.#onClose = onClose;
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
     * Sends a message from the server to the client.
     * @param {any} message
     */

    send(message) {
        this.#send(message);
    }
}