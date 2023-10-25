import RTree from 'rtree';

/**
 * A searchable 2D space.
 */

class Space {
    #rTree = new RTree();

    /**
     * Adds `value`.
     * @param {any} value
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */

    add(value, x, y, width, height) {
        if (width <= 0) throw new Error(`invalid width: ${width}`);
        if (height <= 0) throw new Error(`invalid height: ${height}`);
        this.#rTree.insert({x: x, y: y, w: width, h: height}, value);
    }

    /**
     * Deletes `value`.
     * @param {any} value
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */

    delete(value, x, y, width, height) {
        if (width <= 0) throw new Error(`invalid width: ${width}`);
        if (height <= 0) throw new Error(`invalid height: ${height}`);
        this.#rTree.remove({x: x, y: y, w: width, h: height}, value);
    }

    /**
     * Returns each value in a rectangle.
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @return {any[]}
     */

    search(x, y, width, height) {
        if (width <= 0) throw new Error(`invalid width: ${width}`);
        if (height <= 0) throw new Error(`invalid height: ${height}`);
        return this.#rTree.search({x: x, y: y, w: width, h: height});
    }
}