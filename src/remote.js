import {createPromise} from './async.js';

/**
 * Calls functions on remote objects.
 */

class Remote {
    #callbacks = new Map();
    #id = 0;
    #messageClient;
    #replacer;
    #reviver;

    /**
     * Creates a new `Remote`.
     * @param {MessageClient} messageClient
     * @param {function(key: number|string, value: any): any} [replacer]
     * @param {function(key: number|string, value: any): any} [reviver]
     * @param {function(error: any): void} [onError]
     */

    constructor(messageClient, replacer, reviver, onError) {
        this.#messageClient = messageClient;
        this.#replacer = replacer;
        this.#reviver = reviver;

        messageClient.onMessage(message => {
            let type, path, value;

            try {
                [type, path, value] = JSON.parse(message, this.#reviver);
            } catch (error) {
                function rethrow(error) {
                    throw error;
                }

                (onError ?? rethrow)(error);
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
     * @param {function(key: number|string, value: any): any} replacer
     * @param {function(key: number|string, value: any): any} reviver
     * @param onError
     * @param send
     * @param message
     */

    static callHandler({target, replacer, reviver, onError, send}, message) {
        let type, id, key, values;

        try {
            [type, id, key, values] = JSON.parse(message, reviver);
        } catch (error) {
            function rethrow(error) {
                throw error;
            }

            (onError ?? rethrow)(error);
            return;
        }

        if (type === '__call__') send(['__call__', id, target[key](...values)]);
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
        this.#messageClient.send(JSON.stringify(['__call__', id, key, values], this.#replacer));
        return promise;
    }
}