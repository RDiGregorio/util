import {ObservableMap} from './observable-map.js';
import {createUuid} from './uuid.js';

/**
 * An observable map with a location.
 */

export class Entity extends ObservableMap {

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

    setLocation(worldId, x, y) {
        if (this.worldId === worldId && this.x === x && this.y === y) return;
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