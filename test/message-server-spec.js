import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';

describe('MessageServer', function () {
    it('can echo', function (done) {
        const
            messageServer = new MessageServer({server: createServer()}),
            messageClient = new MessageClient({});

        messageServer.onConnection(messageConnection => messageConnection.onMessage(message =>
            messageConnection.send(message)
        ));

        messageClient.onMessage(message => {
            expect(message).to.equal('hello');
            messageServer.close();
            messageClient.close();
            done();
        });

        messageClient.send('hello');
    });

    it('handles close events', function (done) {
        const messageServer = new MessageServer({server: createServer()});
        messageServer.onClose(done);
        messageServer.close();
    });

    // TODO
    xit('handles errors', function (done) {
        const
            messageServer = new MessageServer({server: createServer()}),
            messageClient = new MessageClient({});

        messageClient.send('hello');
        //messageServer.close();
        //done();
        //return;
        messageServer.onError(error => {
            console.log("TEST@@@@@@@@@@@@@@@@@@@@@@@@@");
            //expect(message).to.equal('hello');
            console.log(error.message);
            messageClient.close();
            messageServer.close();
            done();
        });

        messageServer.onMessage(message => {
            console.log(message);
            throw new Error(message);
        });
    });
});