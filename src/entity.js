import {ObservableMap} from './observable-map.js';
import {createUuid} from './uuid.js';
import {World} from './world.js';

/**
 * An observable object with an id and a location. It can search for nearby objects.
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

    #syncWorld(worldId) {
        const world = Entity.#getWorld(worldId), cancel = this.addEventListener((type, path) => {
            if (path[0] === 'location') {
                world.delete(this);
                this.has('location') && this.worldId === worldId ? world.add(this, this.x, this.y) : cancel();
            }
        });
    }

    /**
     * Deletes the location of the `Entity`.
     */

    deleteLocation() {
        this.delete('location');
    }

    /**
     * Sets the location of the `Entity`.
     * @param {string} worldId
     * @param {number} x
     * @param {number} y
     */

    setLocation(worldId, x, y) {
        if (!Entity.#getWorld(worldId).has(this)) this.#syncWorld(worldId);
        this.set('location', new ObservableMap([['id', worldId], ['x', x], ['y', y]]));
    }

    /**
     * Returns each `Entity` in the same world within the given radius.
     * @param {number} radius
     * @return {Entity[]}
     */

    search(radius) {
        if (!Number.isFinite(radius) || radius < 0) throw new Error(`invalid radius: ${radius}`);
        if (!this.has('location')) return [];
        return Entity.#getWorld(this.worldId).search(this.x - radius, this.y - radius, radius * 2, radius * 2);
    }
}