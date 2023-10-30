import {expect} from 'chai';
import {createServer} from 'http';
import {ObservableMap} from '../src/observable-map.js';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';
import {RemoteModel} from '../src/remote-model.js';
import {createMapReviver, mapReplacer} from '../src/json.js';

describe('RemoteModel', function () {
    it('can copy a remote object', function (done) {
        const messageServer = new MessageServer({
                server: createServer(),
                replacer: mapReplacer,
                reviver: createMapReviver([ObservableMap])
            }),
            messageClient = new MessageClient({
                host: 'localhost',
                replacer: mapReplacer,
                reviver: createMapReviver([ObservableMap])
            });

        messageServer.listen();
        let serverObservableMap;

        messageServer.onConnection((state, send) => {
            serverObservableMap = RemoteModel.server(send);
            serverObservableMap.set('a', new ObservableMap([['b', 0]]));
        });

        const clientObservableMap = RemoteModel.client(messageClient);

        clientObservableMap.addEventListener(() => {
            expect(clientObservableMap).to.eql(serverObservableMap);
            messageClient.close();
            messageServer.close();
            done();
        });
    });
});