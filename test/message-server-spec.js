import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from '../src/message-client.js';

describe('MessageServer', () => {
    let messageServer, messageClient;

    afterEach(() => {
        messageServer.close();
        messageClient.close();
    });

    it('can echo', done => {
        messageServer = new MessageServer({server: createServer()});
        messageClient = new MessageClient({});

        messageServer.onConnection(messageConnection => messageConnection.onMessage(message =>
            messageConnection.send(message)
        ));

        messageClient.onMessage(message => {
            expect(message).to.equal('hello');
            done();
        });

        messageClient.send('hello');
    });

    it('handles close events', done => {
        messageServer = new MessageServer({server: createServer()});
        messageServer.close();
        messageServer.whenClosed.then(done);
    });

    it('handles errors', done => {
        messageServer = new MessageServer({server: createServer()});
        messageClient = new MessageClient({});

        messageClient.send('hello');

        messageServer.onConnection(messageConnection => {
            messageConnection.onMessage(message => {
                throw new Error(message);
            });

            messageConnection.onError(error => {
                expect(error.message).to.equal('hello');
                done();
            });
        });
    });
});