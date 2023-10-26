import RTree from 'rtree';
import _ from 'lodash';

/**
 * A searchable 2D space.
 */

export class Space {
    #rTree = new RTree();

    /**
     * Adds `value` to the given coordinates.
     * @param {any} value
     * @param {number} x
     * @param {number} y
     */

    add(value, x, y) {
        if (!_.isFinite(x)) throw new Error(`invalid x coordinate: ${x}`);
        if (!_.isFinite(y)) throw new Error(`invalid y coordinate: ${y}`);
        this.#rTree.insert({x: x, y: y, w: 1, h: 1}, value);
    }

    /**
     * Deletes `value` from the given coordinates.
     * @param {any} value
     * @param {number} x
     * @param {number} y
     */

    delete(value, x, y) {
        if (!_.isFinite(x)) throw new Error(`invalid x coordinate: ${x}`);
        if (!_.isFinite(y)) throw new Error(`invalid y coordinate: ${y}`);
        this.#rTree.remove({x: x, y: y, w: 1, h: 1}, value);
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
        if (!_.isFinite(x)) throw new Error(`invalid x coordinate: ${x}`);
        if (!_.isFinite(y)) throw new Error(`invalid y coordinate: ${y}`);
        if (!_.isFinite(width) || width < 0) throw new Error(`invalid width: ${width}`);
        if (!_.isFinite(height) || height < 0) throw new Error(`invalid height: ${height}`);
        return this.#rTree.search({x: x, y: y, w: width + 1, h: height + 1});
    }
}