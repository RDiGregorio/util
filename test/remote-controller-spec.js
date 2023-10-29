import {expect} from 'chai';
import {createServer} from 'http';
import {RemoteController} from '../src/remote-controller.js';
import {MessageClient} from '../src/message-client.js';
import {MessageServer} from '../src/message-server.js';

describe('RemoteController', function () {
    it('can call remote functions', function (done) {
        const
            controller = {add: (left, right) => left + right},
            messageServer = new MessageServer({server: createServer()}),
            messageClient = new MessageClient({host: 'localhost'});

        messageServer.listen(send => ({controller, send}));
        messageServer.onMessage(RemoteController.handle);

        new RemoteController(messageClient).call('add', [5, 7]).then(result => {
            expect(result).to.equal(12);
            messageServer.close();
            messageClient.close();
            done();
        })
    });
});