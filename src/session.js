import {MessageServer} from './message-server.js';
import {RemoteController} from './remote-controller.js';
import {RemoteModel} from './remote-model.js';
import {MessageClient} from './message-client.js';

export class Session {

    // the idea is to tie the model/controller code together

    static server({server, createController, replacer, reviver}) {
        const messageServer = new MessageServer({server, replacer, reviver});
        messageServer.listen(send => ({controller: createController(RemoteModel.server(send)), send}));
        messageServer.onMessage(RemoteController.handle);
    }

    static client({host, port, secure, replacer, reviver}) {
        const messageClient = new MessageClient({host, port, secure, replacer, reviver});
    }
}