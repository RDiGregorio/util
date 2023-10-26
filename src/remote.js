class Remote {
    #types;

    constructor(types) {
        this.#types = [...types];
    }

    encodeEvent(type, path, value) {
        return null;
    }

    decodeEvent(string) {
        return null;
    }
}







/**
 * Synchronizes a local and remote `ObservableMap` using JSON encoded events.
 * @param {ObservableMap} observableMap
 * @param {string} eventJson
 * @param {function(key: number|string, value: any): any} reviver
 */

export function remote(observableMap, eventJson, reviver) {
    let {type, path, value} = JSON.parse(eventJson, reviver);

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