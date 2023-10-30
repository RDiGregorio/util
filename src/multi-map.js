/**
 * A map with multiple values per key.
 */

export class MultiMap {
    #map = new Map();

    /**
     * Returns the number of entries.
     * @return {number}
     */

    get size() {
        return [...this.#map.values()].reduce((result, value) => result + value.length, 0);
    }

    /**
     * Returns each entry.
     * @return {Iterable<[any, any]>}
     */

    * [Symbol.iterator]() {
        for (const key of this.#map.keys())
            for (const value of this.#map.get(key))
                yield [key, value];
    }

    /**
     * Deletes an entry. If only `key` is given, then all entries with that key are deleted. Returns true if an entry
     * with that key existed.
     * @param {any} key
     * @param {any} [value]
     * @return {boolean}
     */

    delete(key, value) {
        if (!this.#map.has(key)) return false;
        if (arguments.length <= 1) return this.#map.delete(key);
        const array = this.#map.get(key), result = array.includes(value);
        if (result) array.splice(array.indexOf(value), 1);
        if (this.#map.get(key).length === 0) this.#map.delete(key);
        return result;
    }

    /**
     * Returns each entry.
     * @return {Iterable<[any, any]>}
     */

    * entries() {
        for (const key of this.#map.keys())
            for (const value of this.#map.get(key))
                yield [key, value];
    }

    /**
     * Calls `callback` with each entry.
     * @param {function(value: any, key: any, self: MultiMap)} callback
     * @param {any} [self = this]
     */

    forEach(callback, self = this) {
        for (const key of this.#map.keys())
            for (const value of this.#map.get(key))
                callback.apply(self, [value, key, this]);
    }

    /**
     * Returns a value.
     * @param {any} key
     * @return {Iterable<any>}
     */

    * get(key) {
        if (this.#map.has(key))
            for (const value of this.#map.get(key))
                yield value;
    }

    /**
     * Returns true if an entry for `key` exists.
     * @param {any} key
     * @return {boolean}
     */

    has(key) {
        return this.#map.has(key);
    }

    /**
     * Assigns a value.
     * @param {any} key
     * @param {any} value
     * @return {MultiMap}
     */

    set(key, value) {
        if (!this.#map.has(key)) this.#map.set(key, []);
        this.#map.get(key).push(value);
        return this;
    }

    /**
     * Returns each value.
     * @return {Iterable<any>}
     */

    * values() {
        for (const key of this.#map.keys())
            for (const value of this.#map.get(key))
                yield value;
    }
}