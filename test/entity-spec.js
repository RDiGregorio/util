import {expect} from 'chai';
import {Entity} from '../src/entity.js';

describe('Entity', function () {
    it('can find nearby entities', function (done) {
        const entities = [new Entity(), new Entity(), new Entity(), new Entity()];
        entities[0].setLocation(undefined, 0, 0);
        entities[1].setLocation(undefined, -1, -1);
        entities[2].setLocation(undefined, -1, 2);
        entities[3].setLocation('', 0, 0);
        expect(entities[0].search(0)).to.eql([entities[0]]);
        const result = entities[0].search(1);
        expect(result.length).to.equal(2);
        expect(result.includes(entities[0])).to.equal(true);
        expect(result.includes(entities[1])).to.equal(true);
        expect(result.includes(entities[2])).to.equal(false);
        expect(result.includes(entities[3])).to.equal(false);
        entities[1].deleteLocation();
        expect(entities[0].search(1)).to.eql([entities[0]]);
        entities[0].deleteLocation();
        expect(entities[0].search(1)).to.equal(undefined);
        done();
    });
});