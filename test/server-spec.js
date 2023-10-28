import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';

describe('MessageServer', function () {
    it('can echo', function (done) {
        const
            messageServer = new MessageServer(createServer()),
            messageClient = new MessageClient();

        messageServer.listen(send => send);
        messageServer.onMessage((send, message) => send(message));

        messageClient.onMessage(message => {
            expect(message).to.equal('hello');
            done();
        });

        messageClient.send('hello');
    });
});