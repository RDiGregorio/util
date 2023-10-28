import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {MessageClient} from "../src/message-client.js";

describe('MessageServer', function () {
    it('can echo', function (done) {
        const
            messageServer = new MessageServer(createServer(), 8080),
            messageClient = new MessageClient('localhost', 8080);

        messageServer.connect();
        messageClient.send('hello');
        // TODO
        done();
    });
});