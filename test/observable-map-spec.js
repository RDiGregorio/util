import {expect} from 'chai';
import {ObservableMap} from '../src/observable-map.js';

describe('ObservableMap', function () {
    it('can listen for events', function (done) {
        const observableMap = new ObservableMap();
        let result;
        observableMap.addEventListener((type, path, value) => result = [type, path, value]);
        observableMap.dispatchEvent('a', 0);
        expect(result).to.eql(['a', [], 0]);
        done();
    });
});