/**
 * Returns a random integer between 0 (inclusive) and `number` (exclusive).
 * @param {number} number
 * @return {number}
 */

export function randomInteger(number) {
    return Math.floor(Math.random() * number);
}

/**
 * Returns a random boolean.
 * @return {boolean}
 */

export function randomBoolean() {
    return Math.random() < 0.5;
}