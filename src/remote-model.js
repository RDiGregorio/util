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
        const [promise, resolve] = createPromise();
        let observableMap;

        messageClient.onMessage(message => {
            let messageType, eventType, path, value;

            try {
                [messageType, eventType, path, value] = message;
            } catch (error) {
                return;
            }

            if (messageType === '__update__') {
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
     * Sets the server side model.
     * @param {MessageServer} messageServer
     * @param {ObservableMap} observableMap
     */

    static server(messageServer, observableMap) {
        messageServer.onConnection(send => {
            send(['__update__', 'update', [], observableMap]);

            const cancel = observableMap.addEventListener((type, path, value) => {
                try {
                    send(['__update__', type, path, value]);
                } catch (error) {
                    cancel();
                }
            });
        });
    }
}