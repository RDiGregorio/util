import {expect} from 'chai';
import {createServer} from 'http';
import {Remote} from '../src/remote.js';
import {MessageClient} from '../src/message-client.js';
import {MessageServer} from '../src/message-server.js';

describe('remote', function () {
    it('can call remote functions', function (done) {
        const
            target = {add: (left, right) => left + right},
            messageServer = new MessageServer({server: createServer()}),
            messageClient = new MessageClient({host: 'localhost'});

        messageServer.listen(send => ({target, send}));
        messageServer.onMessage(Remote.callHandler);

        new Remote(messageClient).call('add', [5, 7]).then(result => {
            expect(result).to.equal(12);
            messageServer.close();
            messageClient.close();
            done();
        })
    });

    /*
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
     */
});