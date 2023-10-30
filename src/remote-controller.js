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

            if (type === '__call__') {
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
                    messageClient.send(['__call__', id, key, values]);
                    return promise;
                }
            },
        });
    }

    /**
     * Sets the server side controller.
     * @param {MessageServer} messageServer
     * @param {any} controller
     */

    static server(messageServer, controller) {
        messageServer.onMessage((state, send, message) => {
            let type, id, key, values;

            try {
                [type, id, key, values] = message
            } catch (error) {
                return;
            }

            if (type === '__call__') send(['__call__', id, controller[key](...values)]);
        });
    }
}