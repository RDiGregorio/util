import {MultiMap} from './multi-map.js';

/**
 * A map that dispatches an event when modified. Events propagate to each parent `ObservableMap`.
 */

export class ObservableMap extends Map {
    #eventListeners = new Map();
    #parentKeys = new MultiMap();

    /**
     * Creates a new `ObservableMap`.
     * @param {Iterable<any>} [entries = []]
     */

    constructor(entries = []) {
        super();
        [...entries].forEach(entry => this.set(...entry));
    }

    #dispatchEvent(event) {
        this.#eventListeners.forEach(callback => callback(event.type, event.path, event.value));

        for (const [parent, key] of this.#parentKeys)
            parent.#dispatchEvent({type: event.type, path: [key, ...event.path], value: event.value});
    }

    /**
     * Adds an event listener. Returns a function that removes the event listener.
     * @param {function(type: string, path: any[], value: any): void} callback
     * @return {function(): void}
     */

    addEventListener(callback) {
        const key = {};
        this.#eventListeners.set(key, callback);
        return () => this.#eventListeners.delete(key);
    }

    /**
     * Deletes each entry.
     */

    clear() {
        this.keys().forEach(this.delete);
    }

    /**
     * Deletes an entry. Dispatches a "delete" event and returns true if the entry existed.
     * @param {string} key
     * @return {boolean}
     */

    delete(key) {
        if (!this.has(key)) return false;
        if (this.get(key) instanceof ObservableMap) this.get(key).#parentKeys.delete(this, key);
        super.delete(key);
        this.#dispatchEvent({type: 'delete', path: [key], value: undefined});
        return true;
    }

    /**
     * Dispatches an event to each event listener. Events propagate to each parent `ObservableMap`.
     * @param {string} type
     * @param {any} [value]
     */

    dispatchEvent(type, value) {
        this.#dispatchEvent({type: type, path: [], value: value});
    }

    /**
     * Assigns a value. Dispatches an "update" event if the `ObservableMap` is modified. Returns the `ObservableMap`.
     * @param {string} key
     * @param {any} value
     * @return {ObservableMap}
     */

    set(key, value) {
        if (this.has(key) && this.get(key) === value) return this;
        if (this.get(key) instanceof ObservableMap) this.get(key).#parentKeys.delete(this, key);
        super.set(key, value);
        if (value instanceof ObservableMap) value.#parentKeys.set(this, key);
        this.#dispatchEvent({type: 'update', path: [key], value: value});
        return this;
    }
}