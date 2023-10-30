import {ObservableMap} from './observable-map.js';
import {createPromise} from './async.js';

/**
 * A client side `ObservableMap` that copies a server side `ObservableMap`.
 */

export class RemoteModel {
    /**
     * Returns the client side model.
     * @param {MessageClient} messageClient
     * @return {ObservableMap}
     */

    static client(messageClient) {
        const observableMap = new ObservableMap();

        messageClient.onMessage(message => {
            let messageType, eventType, path, value;

            try {
                [messageType, eventType, path, value] = message;
            } catch (error) {
                return;
            }

            if (messageType === '__update__') {
                if (eventType === 'delete') {
                    if (path.length === 0) throw new Error('missing key for delete event');
                    path = [...path];
                    const key = path.pop(), source = path.reduce((result, key) => result.get(key), observableMap);
                    source.delete(key);
                    return;
                }

                if (eventType === 'update') {
                    if (path.length === 0) {
                        [...value].forEach(entry => observableMap.set(...entry));
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

        return observableMap;
    }

    /**
     * TODO
     * @param {MessageServer} messageServer
     * @return {Promise<ObservableMap>}
     */

    static server(messageServer) {
        messageServer.listen();
        const [promise, resolve] = createPromise();

        messageServer.onConnection((state, send) => {
            const observableMap = new ObservableMap();
            send(['__update__', 'update', [], observableMap]);

            const cancel = observableMap.addEventListener((type, path, value) => {
                try {
                    send(['__update__', type, path, value]);
                } catch (error) {
                    cancel();
                }
            });

            resolve(observableMap);
        });

        return promise;
    }
}