import {WebSocketServer} from 'ws';
import {createMapReviver, mapReplacer} from './json.js';
import {ObservableMap} from './observable-map.js';
import {createPromise} from './promise.js';

class Server {
    #onConnect;
    #onError = console.error;
    #onMessage;
    #server;

    connect(port = 8080) {
        const [promise, resolve] = createPromise();
        this.#server = new WebSocketServer({port: port});
        this.#server.on('error', this.#onError);
        this.#server.on('wsClientError', this.#onError);
        this.#server.on('listening', () => resolve());
        this.#server.on('close', () => resolve());

        this.#server.on('connection', (socket, request) => {
            socket.on('error', this.#onError);

            function send(message) {
                console.debug(`sending: ${message}`);
                socket.send(message);
            }

            try {
                const state = this.#onConnect(request, send);
                socket.on('message', message => this.#onMessage(state, send, `${message}`));
            } catch (error) {
                this.#onError(error);
            }
        });

        return promise;
    }

    close() {
        this.#server.close();
    }

    onConnect(callback) {
        this.#onConnect = callback;
    }

    onError(callback) {
        this.#onError = callback;
    }

    onMessage(callback) {
        this.#onMessage = callback;
    }
}


/**
 * Creates a new server. Returns a function to close the server.
 * @param {ObservableMap} model
 * @param {any} controller
 * @param {function(error: Error): void} onError
 * @return {function()}
 */

function createServer(model, controller, onError = console.error) {
    const server = new WebSocketServer({port: 8080});
    server.on('error', onError);

    server.on('connection', (socket) => {
        function send(value) {
            const message = JSON.stringify(value, mapReplacer);
            console.debug(`sending message: ${message}`);
            socket.send(message);
        }

        socket.on('error', onError);

        socket.on('message', message => {
            try {
                console.debug(`received message: ${message}`);
                const [id, key, values] = JSON.parse(message); //todo: use reviver
                send(['response', id, controller[key](...values)]);
            } catch (error) {
                onError(error);
            }
        });

        model.addEventListener((type, path, value) => send([type, path, value]));
    });

    return () => server.close();
}

//createServer(new ObservableMap(), {f: x => x + 1});

const server = new Server();
server.connect();