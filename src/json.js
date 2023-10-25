import _ from 'lodash';

/**
 * Returns true if `value` is a JSON primitive.
 * @param {any} value
 * @return {boolean}
 */

export function isJsonPrimitive(value) {
    return _.isNull(value) || _.isBoolean(value) || _.isFinite(value) || _.isString(value);
}

/**
 * A replacer for `JSON.stringify` that can encode `Map` objects.
 * @param {any} key
 * @param {any} value
 * @return {any}
 */

export function mapReplacer(key, value) {
    return value instanceof Map ? {__class__: value.constructor.name, __entries__: [...value]} : value;
}

/**
 * A reviver for `JSON.parse` that can decode `Map` objects.
 * @param {Class[]} types
 * @return {function(any, any): any}
 */

export function createMapReviver(types) {
    const map = new Map(types.map(type => [type.name, type]));

    return (key, value) => {
        if (_.isObject(value) && '__class__' in value && '__entries__' in value) {
            if (!map.has(value.__class__)) throw new Error(`missing class: ${value.__class__}`);
            return value.__entries__.reduce((result, entry) => result.set(...entry), new (map.get(value.__class__)));
        }

        return value;
    }
}