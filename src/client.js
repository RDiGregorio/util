import WebSocket from 'ws';

class Client {
    #socket;

    constructor(host, port, secure = false) {
        this.#socket = new WebSocket(`${secure ? 'wss' : 'ws'}://${host}:${port}`);
    }

    onOpen(callback) {

    }

    onError(callback) {

    }
}

const ws = new WebSocket('ws://localhost:8080');

ws.on('error', console.error);

ws.on('open', function open() {
    console.log('test2');
    ws.send('something');
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
});