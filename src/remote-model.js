import {ObservableMap} from './observable-map.js';
import {createPromise} from './async.js';

/**
 * A server side `ObservableMap` that can be viewed by a client.
 */

export class RemoteModel {
    /**
     * Promises the client side model.
     * @param {MessageClient} messageClient
     * @return {Promise<ObservableMap>}
     */

    static client(messageClient) {
        messageClient.send(['__model__']);
        const [promise, resolve] = createPromise();
        let observableMap;

        messageClient.onMessage(message => {
            let messageType, eventType, path, value;

            try {
                [messageType, eventType, path, value] = message;
            } catch (error) {
                return;
            }

            if (messageType === '__model__') {
                if (eventType === 'delete') {
                    path = [...path];
                    const key = path.pop(), source = path.reduce((result, key) => result.get(key), observableMap);
                    source.delete(key);
                    return;
                }

                if (eventType === 'update') {
                    if (path.length === 0) {
                        observableMap = value;
                        resolve(observableMap);
                        return;
                    }

                    path = [...path];
                    const key = path.pop(), source = path.reduce((result, key) => result.get(key), observableMap);
                    source.set(key, value);
                    return;
                }

                path.reduce((result, key) => result.get(key), observableMap).dispatchEvent(eventType, value);
            }
        });

        return promise;
    }

    /**
     * Creates the server side model.
     * @param {MessageServer} messageServer
     * @param {function(messageConnection: MessageConnection): ObservableMap|Promise<ObservableMap>} callback
     */

    static server(messageServer, callback) {
        messageServer.onConnection(async messageConnection => {
            const observableMap = await callback(messageConnection);

            messageServer.onMessage(message => {
                let type;

                try {
                    [type] = message;
                } catch (error) {
                    return;
                }

                if (type === '__model__') messageConnection.send(['__model__', 'update', [], observableMap]);
            });

            const cancel = observableMap.addEventListener((type, path, value) => {
                try {
                    messageConnection.send(['__model__', type, path, value]);
                } catch (error) {
                    cancel();
                }
            });
        });
    }
}