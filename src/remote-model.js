/**
 * Copies the state a remote object.
 */

class RemoteModel {

    /**
     * Creates a new `RemoteModel`.
     * @param {MessageClient} messageClient
     */

    constructor(messageClient) {
        messageClient.onMessage(message => {
            let type, path, value;

            try {
                [type, path, value] = message;
            } catch (error) {
                return;
            }

        });
    }
}