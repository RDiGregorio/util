import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';

describe('MessageServer', function () {
    it('can echo', function (done) {
        const
            messageServer = new MessageServer({server: createServer()}),
            messageClient = new MessageClient({host: 'localhost'});

        messageServer.listen(() => undefined);
        messageServer.onMessage((state, send, message) => send(message));

        messageClient.onMessage(message => {
            expect(message).to.equal('hello');
            messageServer.close();
            messageClient.close();
            done();
        });

        messageClient.send('hello');
    });
});