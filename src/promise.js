/**
 * Returns a [promise, resolve, reject] array.
 * @return {[Promise, function(value?: any): void, function(value?: any): void]}
 */

export function createPromise() {
    const result = [];

    result[0] = new Promise((resolve, reject) => {
        result[1] = resolve;
        result[2] = reject;
    });

    return result;
}