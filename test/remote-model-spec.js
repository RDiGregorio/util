import {expect} from 'chai';
import {createServer} from 'http';
import {ObservableMap} from '../src/observable-map.js';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';
import {RemoteModel} from '../src/remote-model.js';
import {createMapReviver, mapReplacer} from '../src/json.js';

describe('RemoteModel', function () {
    it('can copy a remote object', function (done) {
        const
            observableMaps = [new ObservableMap(), new ObservableMap()],
            messageServer = new MessageServer({
                server: createServer(),
                replacer: mapReplacer,
                reviver: createMapReviver([ObservableMap])
            }),
            messageClient = new MessageClient({
                host: 'localhost',
                replacer: mapReplacer,
                reviver: createMapReviver([ObservableMap])
            });

        messageServer.listen(send => RemoteModel.sendUpdates(observableMaps[0], send));
        new RemoteModel(observableMaps[1], messageClient);

        observableMaps[0].set('a', new ObservableMap([['b', 0]]));

        observableMaps[1].addEventListener(() => {
            expect(observableMaps[0]).to.eql(observableMaps[1]);
            messageClient.close();
            messageServer.close();
            done();
        })
    });
});