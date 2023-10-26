import RTree from 'rtree';
import {MultiMap} from './multi-map.js';

/**
 * A spatial plane with values at coordinates.
 */

export class World {
    #rTree = new RTree();
    #coordinates = new MultiMap();

    /**
     * Adds `value` to the given coordinates.
     * @param {any} value
     * @param {number} x
     * @param {number} y
     */

    add(value, x, y) {
        if (!Number.isFinite(x)) throw new Error(`invalid x coordinate: ${x}`);
        if (!Number.isFinite(y)) throw new Error(`invalid y coordinate: ${y}`);
        this.#coordinates.set(value, [x, y]);
        this.#rTree.insert({x: x, y: y, w: 1, h: 1}, value);
    }

    /**
     * Deletes `value` from the given coordinates. If only `value` is given, it is deleted from all coordinates.
     * @param {any} value
     * @param {number} [x]
     * @param {number} [y]
     */

    delete(value, x, y) {
        if (arguments.length === 1) {
            [...this.#coordinates.get(value)].forEach(array => {
                this.#coordinates.delete(value, array);
                this.delete(value, array[0], array[1]);
            });
        } else {
            if (!Number.isFinite(x)) throw new Error(`invalid x coordinate: ${x}`);
            if (!Number.isFinite(y)) throw new Error(`invalid y coordinate: ${y}`);
            this.#rTree.remove({x: x, y: y, w: 1, h: 1}, value);
        }
    }

    /**
     * Returns each value in the given rectangle.
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {any[]}
     */

    search(x, y, width, height) {
        if (!Number.isFinite(x)) throw new Error(`invalid x coordinate: ${x}`);
        if (!Number.isFinite(y)) throw new Error(`invalid y coordinate: ${y}`);
        if (!Number.isFinite(width) || width < 0) throw new Error(`invalid width: ${width}`);
        if (!Number.isFinite(height) || height < 0) throw new Error(`invalid height: ${height}`);
        return this.#rTree.search({x: x, y: y, w: width + 1, h: height + 1});
    }
}