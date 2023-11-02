/**
 * A connection between a `MessageServer` and a `MessageClient`.
 */

class MessageConnection {
    #close;
    #ip;
    #send;

    /**
     * Creates a new `MessageConnection`.
     * @param {string} ip
     * @param {function(): void} close
     * @param {function(message: string): void} send
     */

    constructor({ip, close, send}) {
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
     * @param {string} message
     */

    send(message) {
        this.#send();
    }
}