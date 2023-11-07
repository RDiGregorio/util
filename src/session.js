import {RemoteModel} from './remote-model.js';
import {RemoteController} from './remote-controller.js';

/**
 * Creates a server side model and controller that can be used by a client. TODO: remove this? it doesn't do enough to justify existing
 */

export class Session {
    /**
     * @param {MessageServer} messageServer
     * @param {function(messageConnection: MessageConnection): ObservableMap|Promise<ObservableMap>} createModel
     * @param {function(model: ObservableMap, messageConnection: MessageConnection): any} createController
     */

    static server({messageServer, createModel, createController}) {
        const models = new Map();

        RemoteModel.server(messageServer, messageConnection => {
            const model = createModel(messageConnection);
            models.set(messageConnection, model);
            return model;
        });

        RemoteController.server(messageServer, async messageConnection => {
            const model = models.get(messageConnection);
            models.delete(messageConnection);
            return createController(await model, messageConnection);
        });
    }

    /**
     * Promises a [model, controller] array.
     * @param {MessageClient} messageClient
     * @return {Promise<[ObservableMap, any]>}
     */

    static async client(messageClient) {
        return [await RemoteModel.client(messageClient), RemoteController.client(messageClient)];
    }
}