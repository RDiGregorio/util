import {expect} from 'chai';
import {Space} from '../src/space.js';

describe('Space', function () {
    it('can add values', function (done) {
        const space = new Space();
        space.add('a', 0, 0);
        expect(space.search(0, 0, 0, 0)).to.eql(['a']);
        expect(space.search(-1, -1, 1, 1)).to.eql(['a']);
        expect(space.search(0, 0, 1, 1)).to.eql(['a']);
        expect(space.search(-1, -1, 2, 2)).to.eql(['a']);
        space.add('b', -2, -1);
        expect(space.search(-2, -1, 1, 1)).to.eql(['b']);
        done();
    });

    it('can delete values', function (done) {
        const space = new Space();
        space.add('a', 0, 0);
        space.add('a', 0, 0);
        space.add('a', 0, 0);
        space.delete('a', 0, 0);
        expect(space.search(0, 0, 0, 0)).to.eql(['a', 'a']);
        done();
    });
});