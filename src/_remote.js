import {createMapReviver, mapReplacer} from './json.js';

/**
 * Synchronizes local and remote `ObservableMap` objects.
 */

export class Remote {
    #mapReviver;

    /**
     * Creates a new `Remote`.
     * @param {Class[]} types
     */

    constructor(types) {
        this.#mapReviver = createMapReviver(types);
    }

    /**
     * Returns a JSON encoded event.
     * @param {string} type
     * @param {any[]} path
     * @param {any} value
     * @return {string}
     */

    static encodeEvent(type, path, value) {
        return JSON.stringify([type, path, value], mapReplacer);
    }

    /**
     * Synchronizes a local and remote `ObservableMap` using JSON encoded events.
     * @param {ObservableMap} observableMap
     * @param {string} encodedEvent
     */

    sync(observableMap, encodedEvent) {
        let [type, path, value] = JSON.parse(encodedEvent, this.#mapReviver);

        if (type === 'delete') {
            if (path.length === 0) throw new Error('missing key for delete event');
            path = [...path];
            const key = path.pop(), source = path.reduce((result, key) => result.get(key), observableMap);
            if (!source.has(key)) throw new Error('failed to sync delete event');
            source.delete(key);
            return;
        }

        if (type === 'update') {
            if (path.length === 0) throw new Error('missing key for update event');
            path = [...path];
            const key = path.pop(), source = path.reduce((result, key) => result.get(key), observableMap);
            if (source.has(key) && source.get(key) === value) throw new Error('failed to sync update event');
            source.set(key, value);
            return;
        }

        path.reduce((result, key) => result.get(key), observableMap).dispatchEvent(type, value);
    }
}