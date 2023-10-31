import {RemoteModel} from './remote-model.js';
import {RemoteController} from './remote-controller.js';

export class Session {
    // todo: need to think about the design here.

    static server({messageServer, createModel, createController}) {
        // todo: need to link the model and controller...

        RemoteModel.server(messageServer, createModel);
        RemoteController.server(messageServer, createController);
    }

    static client(messageClient) {
        const model = RemoteModel.client(messageClient);
        RemoteController.client(messageClient);
    }
}