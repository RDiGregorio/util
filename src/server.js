import {WebSocketServer} from 'ws';

/**
 * Creates a new server. Returns a function to close the server.
 * @param {ObservableMap} model
 * @param {any} controller
 * @param {function(error: Error): void} onError
 * @return {function()}
 */

function createServer(model, controller, onError = console.error) {
    const server = new WebSocketServer({port: 8080});

    server.on('connection', (socket) => {
        socket.on('error', onError);

        socket.on('message', message => {
            console.log("@@@@@@@@@@@@@@")
            console.log(JSON.parse(message));

            const [id, key, values] = JSON.parse(message);
            socket.send(JSON.stringify(['response', id, controller[key](...values)]));
        });

        // todo: model.addEventListener()
    });

    return () => server.close();
}

createServer(null, {f: x => x + 1});