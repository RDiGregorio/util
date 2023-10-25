import {expect} from 'chai';
import {isJsonPrimitive} from '../src/json.js';

describe('isJsonPrimitive', function () {
    it('returns true for JSON primitives', function (done) {
        expect(isJsonPrimitive(null)).to.equal(true);
        expect(isJsonPrimitive(true)).to.equal(true);
        expect(isJsonPrimitive(false)).to.equal(true);
        expect(isJsonPrimitive(0)).to.equal(true);
        expect(isJsonPrimitive(-1)).to.equal(true);
        expect(isJsonPrimitive(-1.5)).to.equal(true);
        expect(isJsonPrimitive("")).to.equal(true);
        expect(isJsonPrimitive("abc")).to.equal(true);
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