import {expect} from 'chai';
import {Entity} from '../src/entity.js';

describe('Entity', function () {
    it('can find nearby entities', function (done) {
        const entities = [new Entity(), new Entity(), new Entity()];
        entities[0].setLocation('', 0, 0);
        entities[1].setLocation('', -1, -1);
        entities[2].setLocation('', -1, 2);
        expect(entities[0].search(0)).to.eql([entities[0]]);
        const result = entities[0].search(1);
        expect(result.length).to.equal(2);
        expect(result.includes(entities[0])).to.equal(true);
        expect(result.includes(entities[1])).to.equal(true);
        expect(result.includes(entities[2])).to.equal(false);
        done();
    });
});