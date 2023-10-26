import {ObservableMap} from './observable-map.js';
import {createUuid} from './uuid.js';

/**
 * A container for entities.
 */

class EntityContainer extends ObservableMap {

    /**
     * Creates a new `EntityContainer`.
     * @param {string} [id = createUuid()]
     */

    constructor([id = createUuid()]) {
        super([['id', id]]);
    }

    /**
     * @return {string}
     */

    get id() {
        return this.get('id');
    }

    addEntity(entity, x, y) {
        // TODO
        entity.set('location', new ObservableMap([['containerId', this.id], ['x', x], ['y', y]]));
    }

    deleteEntity(entity, x, y) {
        // TODO
        entity.delete('location');
    }
}