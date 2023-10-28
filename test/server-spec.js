import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from "../src/message-client.js";

describe('MessageServer', function () {
    it('can echo', function (done) {
        const
            messageServer = new MessageServer(createServer()),
            messageClient = new MessageClient('localhost', 8080);

        messageServer.onMessage((message, state) => {
            console.log(message);
            done();
        });

        messageServer.listen(8080);
        messageClient.send('hello');
        messageClient.send('world');

       // messageClient.onOpen(() => messageClient.send('hello'));

        // TODO
//        done();
    });
});