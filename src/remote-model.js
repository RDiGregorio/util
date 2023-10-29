/**
 * Copies a remote `ObservableMap`.
 */

export class RemoteModel {
    /**
     * Creates a new `RemoteModel`.
     * @param {ObservableMap} observableMap
     * @param {MessageClient} messageClient
     */

    constructor(observableMap, messageClient) {
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
    }

    /**
     * Sends updates to the client side copy.
     * @param {ObservableMap} observableMap
     * @param {function(message: any): void} send
     */

    static sendUpdates(observableMap, send) {
        send(['__update__', 'update', [], observableMap]);

        const cancel = observableMap.addEventListener((type, path, value) => {
            try {
                send(['__update__', type, path, value]);
            } catch (error) {
                console.log(error);
                cancel();
            }
        });
    }
}