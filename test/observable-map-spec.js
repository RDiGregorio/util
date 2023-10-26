import {expect} from 'chai';
import {ObservableMap} from '../src/observable-map.js';
import {createMapReviver, mapReplacer} from "../src/json.js";

describe('ObservableMap', function () {
    it('can listen for events', function (done) {
        let result;

        const
            observableMap = new ObservableMap(),
            cancel = observableMap.addEventListener((type, path, value) => result = [type, path, value]);

        observableMap.dispatchEvent('a', 0);
        expect(result).to.eql(['a', [], 0]);
        observableMap.dispatchEvent('b', 1);
        expect(result).to.eql(['b', [], 1]);
        cancel();
        observableMap.dispatchEvent('c', 2);
        expect(result).to.eql(['b', [], 1]);
        done();
    });

    it('can sync with others', function (done) {
        const observableMaps = [new ObservableMap(), new ObservableMap()];

        function copy(value) {
            return JSON.parse(JSON.stringify(value, mapReplacer), createMapReviver([ObservableMap]));
        }

        observableMaps[0].addEventListener((type, path, value) =>
            observableMaps[1].sync(type, path, copy(value))
        );

        observableMaps[0].set('a', new ObservableMap([['b', 0]]));
        expect(observableMaps[1].get('a').get('b')).to.equal(0);
        let result;
        observableMaps[1].addEventListener((type, path, value) => result = [type, path, value]);
        observableMaps[0].get('a').dispatchEvent('c', 1);
        done();
    });
});