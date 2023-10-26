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

    /**
     * Adds an event listener. Returns a function that removes the event listener.
     * @param {function({type: string, path: any[], value: any}): void} callback
     * @return {function(): void}
     */

    addEventListener(callback) {
        const key = {};
        this.#eventListeners.set(key, callback);

        return () => {
            this.#eventListeners.delete(key);
        };
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
        this.dispatchEvent({type: 'delete', path: [key], value: undefined});
        return true;
    }

    /**
     * Dispatches an event to each event listener. Events propagate to each parent `ObservableMap`.
     * @param {{type: string, path: any[], value: any}} event
     */

    dispatchEvent(event) {
        this.#eventListeners.forEach(callback => callback(event));

        for (const [parent, key] of this.#parentKeys)
            parent.dispatchEvent({type: event.type, path: [key, ...event.path], value: event.value});
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
        this.dispatchEvent({type: 'update', path: [key], value: value});
        return this;
    }

    /**
     * Triggers an event to be dispatched, propagating from `path`, by deleting or updating entries for "delete" or
     * "update" events.
     * @param {{type: string, path: any[], value: any}} event
     */

    triggerEvent(event) {
        if (event.type === 'delete') {
            if (event.path.length === 0) throw new Error('missing key for delete event');
            const path = [...event.path], key = path.pop(), map = path.reduce((result, key) => result.get(key), this);
            if (!map.has(key)) throw new Error('failed to trigger delete event');
            map.delete(key);
            return;
        }

        if (event.type === 'update') {
            if (event.path.length === 0) throw new Error('missing key for update event');
            const path = [...event.path], key = path.pop(), map = path.reduce((result, key) => result.get(key), this);
            if (map.has(key) && map.get(key) === event.value) throw new Error('failed to trigger update event');
            map.set(key, event.value);
            return;
        }

        event.path.reduce((result, key) => result.get(key), this).dispatchEvent({
            type: event.type,
            path: [],
            value: event.value
        });
    }
}