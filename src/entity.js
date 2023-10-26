import {ObservableMap} from './observable-map.js';
import {createUuid} from './uuid.js';
import {World} from "./world.js";

/**
 * An `ObservableMap` with a location in a `World`.
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

    static #getWorld(id) {
        if (!Entity.#worlds.has(id)) Entity.#worlds.set(id, new World());
        return Entity.#worlds.get(id);
    }

    #syncWorld(world) {
        const cancel = this.addEventListener((type, path) => {
            if (path[0] === 'location') {
                world.delete(this);
                this.worldId === world.id ? world.add(this, this.x, this.y) : cancel();
            }
        });
    }

    setLocation(worldId, x, y) {
        const world = Entity.#getWorld(worldId);
        if (!world.has(this)) this.#syncWorld(world);
        this.set('location', new ObservableMap([['id', worldId], ['x', x], ['y', y]]));
    }
}