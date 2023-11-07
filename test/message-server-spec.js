import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';

describe('MessageServer', () => {
    it('can echo', done => {
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

    it('handles close events', done => {
        const messageServer = new MessageServer({server: createServer()});
        messageServer.onClose(done);
        messageServer.close();
    });

    it('handles errors', done => {
        const
            messageServer = new MessageServer({server: createServer()}),
            messageClient = new MessageClient({});

        messageClient.send('hello');

        messageServer.onConnection(messageConnection => {
            messageConnection.onMessage(message => {
                throw new Error(message);
            });

            messageConnection.onError(error => {
                expect(error.message).to.equal('hello');
                messageClient.close();
                messageServer.close();
                done();
            });
        });
    });
});