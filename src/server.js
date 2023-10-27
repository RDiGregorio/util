import {WebSocketServer} from 'ws';
import {mapReplacer} from './json.js';
import {ObservableMap} from './observable-map.js';

class Server {
    constructor(model, controller, types, onError = console.error) {
    }

    connect() {

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

createServer(new ObservableMap(), {f: x => x + 1});