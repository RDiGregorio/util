import {MessageServer} from './message-server.js';
import {MessageClient} from './message-client.js';
import {RemoteModel} from './remote-model.js';
import {RemoteController} from './remote-controller.js';

export class Session {
    //todo: need to think about the design here.

    static server({server, port, createModel, createController, replacer, reviver}) {
        const messageServer = new MessageServer({server, port, replacer, reviver});
        RemoteModel.server(messageServer, createModel);
        RemoteController.server(messageServer, createController);
        return messageServer;
    }

    static client({host, port, secure, replacer, reviver}) {
        const messageClient = new MessageClient({host, port, secure, replacer, reviver});
        RemoteModel.client(messageClient);
        RemoteController.client(messageClient);
        return messageClient;
    }
}