import {expect} from 'chai';
import {Plane} from '../src/plane.js';

describe('Plane', function () {
    it('can add values', function (done) {
        const plane = new Plane();
        plane.add('a', 0, 0);
        expect(plane.search(0, 0, 0, 0)).to.eql(['a']);
        expect(plane.search(-1, -1, 1, 1)).to.eql(['a']);
        expect(plane.search(0, 0, 1, 1)).to.eql(['a']);
        expect(plane.search(-1, -1, 2, 2)).to.eql(['a']);
        plane.add('b', -2, -1);
        expect(plane.search(-2, -1, 1, 1)).to.eql(['b']);
        done();
    });

    it('can delete values', function (done) {
        const plane = new Plane();
        plane.add('a', 0, 0);
        plane.add('a', 0, 0);
        plane.add('a', 0, 0);
        plane.delete('a', 0, 0);
        expect(plane.search(0, 0, 0, 0)).to.eql(['a', 'a']);
        done();
    });
});