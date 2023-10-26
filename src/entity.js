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
     * Returns the id of the `EntityContainer` that contains it.
     * @return {string}
     */

    get containerId() {
        return this.get('location')?.get('containerId');
    }

    /**
     * Returns the id.
     * @return {string}
     */

    get id() {
        return this.get('id');
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

    setLocation(containerId, x, y) {
        if (this.containerId === containerId && this.x === x && this.y === y) return;
        this.set('location', new ObservableMap([['containerId', containerId], ['x', x], ['y', y]]));
        // todo: this is observable, meaning it can be decoupled from entity container
        //EntityContainer.find

        // I don't really like using a factory constructor... use a find function?
        // const entityContainer = new EntityContainer(containerId);
        // entityContainer
    }
}