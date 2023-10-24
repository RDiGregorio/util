import {randomInteger} from './random.js';

let count = 0;

/**
 * Returns a universally unique identifier.
 * @return {string}
 */

export function uuid() {
    return [randomInteger(2 ** 32), Date.now(), count++].map(number => number.toString(16)).join('-');
}