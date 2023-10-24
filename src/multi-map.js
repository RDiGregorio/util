/**
 * A map with multiple values per key.
 */

export class MultiMap {
    #internal = new Map();

    /**
     * Returns the number of entries.
     * @return {number}
     */

    get size() {
        return [...this.#internal.values()].reduce((result, value) => result + value.size, 0);
    }

    /**
     * Returns each entry.
     * @return {Iterable<[any, any]>}
     */

    * [Symbol.iterator]() {
        for (const key of this.#internal.keys())
            for (const value of this.#internal.get(key))
                yield [key, value];
    }

    /**
     * Deletes an entry. Returns true if the entry existed.
     * @param {any} key
     * @param {any} [value]
     * @return {boolean}
     */

    delete(key, value) {
        if (!this.#internal.has(key)) return false;
        if (arguments.length === 1) return this.#internal.delete(key);
        const result = this.#internal.get(key).delete(value);
        if (this.#internal.get(key).size === 0) this.#internal.delete(key);
        return result;
    }

    /**
     * Returns each entry.
     * @return {Iterable<[any, any]>}
     */

    * entries() {
        for (const key of this.#internal.keys())
            for (const value of this.#internal.get(key))
                yield [key, value];
    }

    /**
     * Calls `callback` with each entry.
     * @param {function(any, any, MultiMap)} callback
     * @param {any} [self = this]
     */

    forEach(callback, self = this) {
        for (const key of this.#internal.keys())
            for (const value of this.#internal.get(key))
                callback.apply(self, [value, key, this]);
    }

    /**
     * Returns a value.
     * @param {any} key
     * @return {Iterable<any>}
     */

    * get(key) {
        if (this.#internal.has(key))
            for (const value of this.#internal.get(key))
                yield value;
    }

    /**
     * Assigns a value.
     * @param {any} key
     * @param {any} value
     * @return {MultiMap}
     */

    set(key, value) {
        if (!this.#internal.has(key)) this.#internal.set(key, new Set());
        this.#internal.get(key).add(value);
        return this;
    }

    /**
     * Returns each value.
     * @return {Iterable<any>}
     */

    * values() {
        for (const key of this.#internal.keys())
            for (const value of this.#internal.get(key))
                yield value;
    }
}