import {RemoteModel} from './remote-model.js';
import {RemoteController} from './remote-controller.js';

/**
 * Creates a server side model and controller that can be used by a client.
 */

export class Session {
    /**
     * @param {MessageServer} messageServer
     * @param {function(connectionInfo: {id: number, ip: string}): ObservableMap|Promise<ObservableMap>} createModel
     * @param {function(model: ObservableMap, connectionInfo: {id: number, ip: string}): any} createController
     */

    static server({messageServer, createModel, createController}) {
        const models = new Map();

        RemoteModel.server(messageServer, connectionInfo => {
            const model = createModel(connectionInfo);
            models.set(connectionInfo.id, model);
            return model;
        });

        RemoteController.server(messageServer, async connectionInfo => {
            const model = models.get(connectionInfo.id);
            models.delete(connectionInfo.id);
            return createController(await model, connectionInfo);
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