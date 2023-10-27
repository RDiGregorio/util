import {expect} from 'chai';
import {ObservableMap} from '../src/observable-map.js';
import {createMapReviver, mapReplacer} from '../src/json.js';
import {Remote} from '../src/remote.js';

describe('remote', function () {
    it('can sync local and remote maps', function (done) {
        const observableMaps = [new ObservableMap(), new ObservableMap()], remote = new Remote([ObservableMap]);

        observableMaps[0].addEventListener((type, path, value) =>
            remote.sync(observableMaps[1], Remote.encodeEvent(type, path, value))
        );

        observableMaps[0].set('a', new ObservableMap([['b', 0]]));
        expect(observableMaps[1].get('a').get('b')).to.equal(0);
        let result;
        observableMaps[1].addEventListener((type, path, value) => result = [type, path, value]);
        observableMaps[0].get('a').dispatchEvent('c', 1);
        expect(result).to.eql(['c', ['a'], 1]);
        done();
    });
});