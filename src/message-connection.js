/**
 * A connection between a `MessageServer` and a `MessageClient`.
 */

export class MessageConnection {
    #close;
    #ip;
    #send;

    /**
     * Creates a new `MessageConnection`.
     * @param {string} ip
     * @param {function(message: any): void} send
     * @param {function(): void} close
     */

    constructor({ip, send, close}) {
        this.#ip = ip;
        this.#close = close;
        this.#send = send;
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
     * Sends a message from the server to the client.
     * @param {any} message
     */

    send(message) {
        this.#send(message);
    }
}