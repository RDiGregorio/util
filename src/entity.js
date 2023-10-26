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
     * Returns the location id.
     * @return {string}
     */

    get locationId() {
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

    setLocation(locationId, x, y) {
        if (this.locationId === locationId && this.x === x && this.y === y) return;
        this.set('location', new ObservableMap([['id', locationId], ['x', x], ['y', y]]));
        // todo: this is observable, meaning it can be decoupled from entity container
    }
}