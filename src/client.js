import WebSocket from 'ws';
import {createPromise} from './promise.js';

class Client {
    #callbacks = new Map();
    #id = 0;
    #model;
    #onError;
    #socket;

    /**
     * @param {ObservableMap} model
     * @param {function(error: Error): void} onError
     */

    constructor(model, onError = console.error) {
        this.#model = model;
        this.#onError = onError;
    }

    get model() {
        return this.#model;
    }

    call(key, values) { // todo: reject after a timeout?
        const id = this.#id++, promise = new Promise(resolve => this.#callbacks.set(id, resolve));
        this.#socket.send(JSON.stringify([id, key, values]));
        return promise;
    }

    close() {
        this.#socket.close();
    }

    connect(host = 'localhost', port = 8080) {
        const [promise, resolve] = createPromise();
        this.#socket = new WebSocket(`ws://${host}:${port}`);
        this.#socket.on('error', this.#onError);
        this.#socket.on('open', () => resolve());
        this.#socket.on('close', () => resolve());

        this.#socket.on('message', message => {
            try {
                const [type, path, value] = JSON.parse(message);

                if (type === 'response') {
                    const callback = this.#callbacks.get(path);
                    this.#callbacks.delete(path);
                    callback(value);
                }

                // todo: handle model messages
            } catch (error) {
                this.#onError(error);
            }
        });

        return promise;
    }
}

const client = new Client(null);
console.log(await client.connect());
console.log("xxxxx")
console.log(await client.call('f', [1]));

/*

function createClient(host = 'localhost', port = 8080, onError = console.error) {
    const socket = new WebSocket(`ws://${host}:${port}`);
    socket.on('error', onError);

    socket.on('open', () => {
        socket.send(JSON.stringify(['print', 'hello world']));
    });
}

// createClient();


/*
ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
});
*/