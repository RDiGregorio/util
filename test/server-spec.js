import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from "../src/message-client.js";

describe('MessageServer', function () {
    it('can echo', function (done) {
        const
            messageServer = new MessageServer(createServer()),
            messageClient = new MessageClient('localhost', 8080);

        messageServer.listen(8080, socket => socket);
        messageServer.onMessage((socket, message) => socket.send(message));

        messageClient.onMessage(message => {
            expect(message).to.equal('hello');
            done();
        });

        messageClient.send('hello');
    });
});