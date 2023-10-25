import {expect} from 'chai';
import {createMapReviver, isJsonPrimitive, mapReplacer} from '../src/json.js';
import {ObservableMap} from '../src/observable-map.js';

describe('isJsonPrimitive', function () {
    it('returns true for JSON primitives', function (done) {
        expect(isJsonPrimitive(null)).to.equal(true);
        expect(isJsonPrimitive(true)).to.equal(true);
        expect(isJsonPrimitive(false)).to.equal(true);
        expect(isJsonPrimitive(0)).to.equal(true);
        expect(isJsonPrimitive(-1)).to.equal(true);
        expect(isJsonPrimitive(-1.5)).to.equal(true);
        expect(isJsonPrimitive('')).to.equal(true);
        expect(isJsonPrimitive('abc')).to.equal(true);
        done();
    });

    it('returns false otherwise', function (done) {
        expect(isJsonPrimitive(undefined)).to.equal(false);
        expect(isJsonPrimitive(Infinity)).to.equal(false);
        expect(isJsonPrimitive({})).to.equal(false);
        expect(isJsonPrimitive([])).to.equal(false);
        done();
    });
});

describe('mapReplacer and createMapReviver', function () {
    it('can replace and revive maps', function (done) {
        const
            input = new ObservableMap([['a', 0], ['b', 1], ['c', {'d': [0, 1, 2]}]]),
            string = JSON.stringify(input, mapReplacer),
            output = JSON.parse(string, createMapReviver([Map, ObservableMap]));

        expect(output instanceof ObservableMap).to.equal(true);
        expect(input).to.eql(output);
        done();
    });
});