import { createContext } from './util/createContext';
import EventBus from 'events';
import Manager from './manager';

const name = Symbol('slot-fill');

function throwOutOfContext() {
    throw new Error('use SlotFill Context out of the Context');
}
export interface Context {
    eventBusSession: EventBus;
    manager: Manager;
}

const [createProvider, useCustomer] = createContext<Context>(name, {
    eventBusSession: throwOutOfContext as unknown as EventBus,
    manager: throwOutOfContext as unknown as Manager,
});

export { createProvider, useCustomer };
