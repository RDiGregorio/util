import {createPromise} from './async.js';

/**
 * Calls functions on remote objects.
 */

export class RemoteController {
    #callbacks = new Map();
    #id = 0;
    #messageClient;

    /**
     * Creates a new `Remote`.
     * @param {MessageClient} messageClient
     */

    constructor(messageClient) {
        this.#messageClient = messageClient;

        messageClient.onMessage(message => {
            let type, path, value;

            try {
                [type, path, value] = JSON.parse(message);
            } catch (error) {
                return;
            }

            if (type === '__call__') {
                const resolve = this.#callbacks.get(path);
                this.#callbacks.delete(path);
                resolve(value);
            }
        });
    }

    /**
     * @param {any} target
     * @param {function(message: string): void} send
     * @param {string} message
     */

    static callHandler({target, send}, message) {
        let type, id, key, values;

        try {
            [type, id, key, values] = JSON.parse(message);
        } catch (error) {
            return;
        }

        if (type === '__call__') send(JSON.stringify(['__call__', id, target[key](...values)]));
    }

    /**
     * Calls a remote function.
     * @param {string} key
     * @param {any[]} values
     * @return {Promise<any>}
     */

    call(key, values) {
        const id = this.#id++, [promise, resolve] = createPromise();
        this.#callbacks.set(id, resolve);
        this.#messageClient.send(JSON.stringify(['__call__', id, key, values]));
        return promise;
    }
}