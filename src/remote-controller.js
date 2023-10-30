import {createPromise} from './async.js';

/**
 * A server side object with functions that can be called by a client.
 */

export class RemoteController {
    /**
     * Returns the client side controller.
     * @param {MessageClient} messageClient
     * @return {any}
     */

    static client(messageClient) {
        const callbacks = new Map();
        let count = 0;

        messageClient.onMessage(message => {
            let type, path, value;

            try {
                [type, path, value] = message;
            } catch (error) {
                return;
            }

            if (type === '__controller__') {
                const resolve = callbacks.get(path);
                callbacks.delete(path);
                resolve(value);
            }
        });

        return new Proxy({}, {
            get(object, key) {
                return (...values) => {
                    const id = count++, [promise, resolve] = createPromise();
                    callbacks.set(id, resolve);
                    messageClient.send(['__controller__', id, key, values]);
                    return promise;
                }
            },
        });
    }

    /**
     * Creates the server side controller.
     * @param {MessageServer} messageServer
     * @param {function(request: IncomingMessage): any} callback
     */

    static server(messageServer, callback) {
        messageServer.onConnection(request => {
            const controller = callback(request);

            messageServer.onMessage((send, message) => {
                let type, id, key, values;

                try {
                    [type, id, key, values] = message
                } catch (error) {
                    return;
                }

                if (type === '__controller__') send(['__controller__', id, controller[key](...values)]);
            });
        });
    }
}