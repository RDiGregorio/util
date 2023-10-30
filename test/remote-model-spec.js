import {expect} from 'chai';
import {createServer} from 'http';
import {ObservableMap} from '../src/observable-map.js';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';
import {RemoteModel} from '../src/remote-model.js';
import {createMapReviver, mapReplacer} from '../src/json.js';

describe('RemoteModel', function () {
    it('can view a remote object', function (done) {
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

        const serverModel = new ObservableMap();
        RemoteModel.server(messageServer, () => serverModel);
        serverModel.set('a', new ObservableMap([['b', 0]]));

        RemoteModel.client(messageClient).then(clientModel => {
            expect(serverModel).to.eql(clientModel);
            serverModel.set('c', new ObservableMap([['d', 0]]));

            clientModel.addEventListener(() => {
                expect(serverModel).to.eql(clientModel);
                messageClient.close();
                messageServer.close();
                done();
            });
        });
    });
});