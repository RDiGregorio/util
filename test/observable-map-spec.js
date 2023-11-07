import {expect} from 'chai';
import {ObservableMap} from '../src/observable-map.js';

describe('ObservableMap', () => {
    it('can listen for events', done => {
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
});