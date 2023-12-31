import {expect} from 'chai';
import {World} from '../src/world.js';

describe('World', () => {
    it('can add values', done => {
        const world = new World();
        expect(world.size).to.equal(0);
        world.add('a', 0, 0);
        expect(world.size).to.equal(1);
        expect(world.search(0, 0, 0, 0)).to.eql(['a']);
        expect(world.search(-1, -1, 1, 1)).to.eql(['a']);
        expect(world.search(0, 0, 1, 1)).to.eql(['a']);
        expect(world.search(-1, -1, 2, 2)).to.eql(['a']);
        world.add('b', -2, -1);
        expect(world.size).to.equal(2);
        expect(world.search(-2, -1, 1, 1)).to.eql(['b']);
        done();
    });

    it('can delete values', done => {
        const world = new World();
        world.add('a', 0, 0);
        world.add('a', 0, 0);
        world.add('a', 0, 0);
        world.delete('a', 0, 0);
        expect(world.size).to.equal(3);
        expect(world.search(0, 0, 0, 0)).to.eql(['a', 'a']);
        world.add('b', 0, 0);
        world.delete('a');
        expect(world.search(0, 0, 0, 0)).to.eql(['b']);
        expect(world.size).to.equal(1);
        done();
    });

    it('it is iterable', done => {
        const world = new World();
        world.add('a', 0, 1);
        world.add('b', 2, 3);
        expect([...world]).to.eql([['a', [0, 1]], ['b', [2, 3]]]);
        expect([...world.entries()]).to.eql([['a', [0, 1]], ['b', [2, 3]]]);
        done();
    });
});