import {expect} from 'chai';
import {createServer} from 'http';
import {RemoteController} from '../src/remote-controller.js';
import {MessageClient} from '../src/message-client.js';
import {MessageServer} from '../src/message-server.js';

describe('RemoteController', () => {
    let messageServer, messageClient;

    afterEach(() => {
        messageServer.close();
        messageClient.close();
    });

    it('can call remote functions', done => {
        messageServer = new MessageServer({server: createServer()});
        messageClient = new MessageClient({});
        RemoteController.server(messageServer, () => ({add: (left, right) => left + right}));

        RemoteController.client(messageClient).add(5, 7).then(result => {
            expect(result).to.equal(12);
            done();
        });
    });
});