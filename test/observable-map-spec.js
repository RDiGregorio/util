import {expect} from 'chai';
import {ObservableMap} from '../src/observable-map.js';

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
        observableMaps[0].addEventListener(observableMaps[1].sync);

        observableMaps[1].addEventListener((type, path, value) => {
            console.log(value);
        });

        observableMaps[0].set('a', new ObservableMap([['b', 0]]));
        done();
    });
});