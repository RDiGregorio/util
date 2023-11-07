import {expect} from 'chai';
import {createServer} from 'http';
import {MessageServer} from '../src/message-server.js';
import {createMapReviver, mapReplacer} from '../src/json.js';
import {ObservableMap} from '../src/observable-map.js';
import {MessageClient} from '../src/message-client.js';
import {Session} from '../src/session.js';
import {createPromise} from '../src/async.js';

describe('Session', () => {
    it('creates remote models and remote controllers', done => {
        const messageServer = new MessageServer({
                server: createServer(),
                replacer: mapReplacer,
                reviver: createMapReviver([ObservableMap])
            }),
            messageClient = new MessageClient({
                replacer: mapReplacer,
                reviver: createMapReviver([ObservableMap])
            });

        function createModel() {
            const [promise, resolve] = createPromise();
            resolve(new ObservableMap([['value', 5]]));
            return promise;
        }

        function createController(model) {
            const [promise, resolve] = createPromise();

            resolve({
                add: (value) => {
                    model.set('value', model.get('value') + value);
                    return model.get('value');
                }
            });

            return promise;
        }

        Session.server({messageServer, createModel, createController});

        Session.client(messageClient).then(([clientModel, clientController]) => {
            clientController.add(10).then(result => {
                expect(result).to.equal(15);
                expect(clientModel.get('value')).to.equal(15);
                messageClient.close();
                messageServer.close();
                done();
            });
        });
    });
});