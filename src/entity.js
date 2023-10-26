import _ from 'lodash';
import {ObservableMap} from './observable-map.js';
import {createUuid} from './uuid.js';
import {World} from "./world.js";

/**
 * An observable map with a location.
 */

export class Entity extends ObservableMap {
    static #worlds = new Map();

    /**
     * Creates a new `Entity`.
     * @param {string} [id]
     */

    constructor(id = createUuid()) {
        super([['id', id]]);
    }

    get #world() {
        if (!this.has('location')) return undefined;
        if (!Entity.#worlds.has(this.worldId)) Entity.#worlds.set(this.worldId, new World());
        return Entity.#worlds.get(this.worldId);
    }

    /**
     * Returns the id.
     * @return {string}
     */

    get id() {
        return this.get('id');
    }

    /**
     * Returns the world id.
     * @return {string}
     */

    get worldId() {
        return this.get('location')?.get('id');
    }

    /**
     * Returns the x coordinate.
     * @return {number}
     */

    get x() {
        return this.get('location')?.get('x');
    }

    /**
     * Returns the y coordinate.
     * @return {number}
     */

    get y() {
        return this.get('location')?.get('y');
    }

    setLocation(worldId, x, y) {
        // I need to handle the case where the entity is loaded from disk

        if (!this.has('location') || this.worldId !== worldId) {
            //
        }

        // if (!_.isString(worldId)) throw new Error(`invalid world id: ${worldId}`);


        // if (this.worldId === worldId && this.x === x && this.y === y) return;
        this.set('location', new ObservableMap([['id', worldId], ['x', x], ['y', y]]));
    }

    sync(world) {
        const cancel = this.addEventListener((type, path) => {
            if (path[0] === 'location') {
                world.delete(this);
                this.worldId === world.id ? world.add(this, this.x, this.y) : cancel();
            }
        });
    }
}