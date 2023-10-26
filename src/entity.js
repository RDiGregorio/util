import {ObservableMap} from './observable-map.js';

/**
 * An observable map with a location. The location is set by adding it to an `EntityContainer`.
 */

class Entity extends ObservableMap {

    /**
     * Returns the container id.
     * @return {string}
     */

    get containerId() {
        return this.get('location')?.get('containerId');
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
}