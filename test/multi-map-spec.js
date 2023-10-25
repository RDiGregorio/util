import {expect} from 'chai';
import {MultiMap} from '../src/multi-map.js';

describe('MultiMap', function () {
    it('can have multiple values per key', function (done) {
        const multiMap = new MultiMap();
        multiMap.set('a', 0);
        multiMap.set('a', 0);
        multiMap.set('a', 1);
        multiMap.set('b', 2);
        expect([...multiMap.get('a')]).to.eql([0, 0, 1]);
        expect([...multiMap.get('b')]).to.eql([2]);
        done();
    });
});