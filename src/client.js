import WebSocket from 'ws';

class Client {
    #socket;

    constructor(host, port, secure = false) {
        this.#socket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
    }

    onClose(callback) {
        this.#socket.on('close', callback);
    }

    onOpen(callback) {
        this.#socket.on('open', callback);
    }

    onError(callback) {
        this.#socket.on('error', callback);
    }

    onMessage(callback) {
        this.#socket.on('message', callback);
    }

    close() {
        this.#socket.close();
    }
}