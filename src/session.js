import {MessageServer} from './message-server.js';
import {RemoteController} from './remote-controller.js';
import {RemoteModel} from './remote-model.js';

class Session {

    // the idea is to tie the model/controller code together

    constructor({server, createController, replacer, reviver}) {
        const messageServer = new MessageServer({server, replacer, reviver});
        messageServer.listen(send => ({controller: createController(RemoteModel.server(send)), send}));
        messageServer.onMessage(RemoteController.handle);
    }
}