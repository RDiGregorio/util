import {MessageServer} from './message-server.js';
import {MessageClient} from './message-client.js';
import {RemoteModel} from './remote-model.js';
import {RemoteController} from './remote-controller.js';

export class Session {

    // the idea is to tie the model/controller code together

    static server({server, port, model, controller, replacer, reviver}) {
        const messageServer = new MessageServer({server, port, replacer, reviver});
        RemoteModel.server(messageServer, model);
        RemoteController.server(messageServer, controller);
        return messageServer.close;
    }

    static client({host, port, secure, replacer, reviver}) {
        const messageClient = new MessageClient({host, port, secure, replacer, reviver});
    }
}