import {ObservableMap} from './observable-map.js';

/**
 * An observable map with an x and y coordinate.
 */

class ObservableLocatableMap extends ObservableMap {

    /**
     * Creates a new `ObservableLocatableMap`.
     * @param {number} x
     * @param {number} y
     */

    constructor(x, y) {
        super();
        this.setLocation(x, y);
    }

    /**
     * Returns the x coordinate.
     * @return {number}
     */

    get x() {
        return this.get('location').get('x');
    }

    /**
     * Returns the y coordinate.
     * @return {number}
     */

    get y() {
        return this.get('location').get('y');
    }

    /**
     * Sets the x and y coordinates.
     * @param {number} x
     * @param {number} y
     */

    setLocation(x, y) {
        if (this.x !== x || this.y !== y) this.set('location', new ObservableMap([['x', x], ['y', y]]));
    }
}