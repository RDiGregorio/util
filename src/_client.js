import WebSocket from 'ws';
import {createPromise} from './promise.js';
import {createMapReviver, mapReplacer} from './json.js';

class Client {
    #callbacks = new Map();
    #id = 0;
    #model;
    #onError;
    #mapReviver;
    #socket;

    /**
     * Creates a new `Client`.
     * @param {ObservableMap} model
     * @param {Class[]} types
     * @param {function(error: any): void} [onError = console.error]
     */

    constructor(model, types, onError = console.error) {
        this.#model = model;
        this.#mapReviver = createMapReviver(types);
        this.#onError = onError
    }

    get model() {
        return this.#model;
    }

    call(key, values) {
        const id = this.#id++, [promise, resolve] = createPromise();
        this.#callbacks.set(id, resolve);
        this.#socket.send(JSON.stringify([id, key, values], mapReplacer));
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
                const [type, path, value] = JSON.parse(message, this.#mapReviver);

                if (type === 'response') {
                    const callback = this.#callbacks.get(path);
                    this.#callbacks.delete(path);
                    callback(value);
                } else
                    this.#handleEvent(type, path, value);
            } catch (error) {
                this.#onError(error);
            }
        });

        return promise;
    }

    #handleEvent(type, path, value) {
        // TODO
        console.log(type, path, value);
    }
}

const client = new Client(null, []);
console.log(await client.connect());
console.log(await client.call('f', [1]));