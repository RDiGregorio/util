import {expect} from 'chai';
import {createServer} from 'http';
import {ObservableMap} from '../src/observable-map.js';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';
import {RemoteModel} from '../src/remote-model.js';

describe('RemoteModel', function () {
    it('can copy a remote object', function (done) {
        const observableMaps = [new ObservableMap(), new ObservableMap()]

        const
            messageServer = new MessageServer({server: createServer()}),
            messageClient = new MessageClient({host: 'localhost'});

        messageServer.listen(send => RemoteModel.sendUpdates(observableMaps[0], send));

        const remoteModel = new RemoteModel(observableMaps[1], messageClient);

        observableMaps[0].set('a', new ObservableMap([['b', 0]]));
        console.log(observableMaps[0]);

        observableMaps[1].addEventListener(() => {
            expect(observableMaps[0]).to.eql(observableMaps[1]);
            done();
        })
    });
});