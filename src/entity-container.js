import {ObservableMap} from './observable-map.js';
import {createUuid} from './uuid.js';
import {World} from './world.js';

/**
 * A container for entities.
 */

export class EntityContainer extends ObservableMap { //does this even need to be observable?
    static #entityContainers = new Map(); //todo: might not even need this
    world = new World();

    /**
     * Creates a new `EntityContainer`.
     * @param {string} [id]
     */

    constructor(id = createUuid()) {
        super([['id', id]]);
        if (EntityContainer.#entityContainers.has(id)) throw new Error(`duplicate id: ${id}`);
        EntityContainer.#entityContainers.set(id, this);
    }

    /**
     * Returns the id.
     * @return {string}
     */

    get id() {
        return this.get('id');
    }

    /**
     * Returns the `EntityContainer` with the given id.
     * @param {string} id
     * @return {EntityContainer}
     */

    static find(id) {
        return EntityContainer.#entityContainers.get(id);
    }

    update(entity) {
        // TODO: instead use this
    }

    addEntity(entity, x, y) {
        // can get the existing location before setting x, y
        // TODO

        this.world.add(entity, x, y);
        entity.set('location', new ObservableMap([['containerId', this.id], ['x', x], ['y', y]]));
    }

    deleteEntity(entity) {
        // TODO
        entity.delete('location');
        this.world.delete(entity, entity.x, entity.y);
    }
}