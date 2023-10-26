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

    it('can delete entries', function (done) {
        const multiMap = new MultiMap();
        multiMap.set('a', 0);
        multiMap.set('a', 1);
        multiMap.delete('a', 0);
        expect([...multiMap.get('a')]).to.eql([1]);
        multiMap.delete('a', 1);
        expect(multiMap.has('a')).to.equal(false);
        done();
    });

    it('has the correct size', function (done) {
        const multiMap = new MultiMap();
        expect(multiMap.size).to.equal(0);
        multiMap.set('a', 0);
        multiMap.set('a', 0);
        multiMap.set('a', 1);
        multiMap.set('b', 2);
        expect(multiMap.size).to.equal(4);
        multiMap.delete('a', 0);
        expect(multiMap.size).to.equal(3);
        done();
    });

    it('it is iterable', function (done) {
        const multiMap = new MultiMap();
        multiMap.set('a', 0);
        multiMap.set('b', 1);
        expect([...multiMap.entries()]).to.eql([['a', 0], ['b', 1]]);
        expect([...multiMap]).to.eql([['a', 0], ['b', 1]]);
        done();
    });
});