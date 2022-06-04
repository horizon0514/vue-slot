import EventBus from 'events';
import { DidMountEvent, DidUpdateEvent, WillUnmountEvent } from './EventTypes';
import { Component } from './components/Slot';
import { ComponentInternalInstance } from 'vue';

export type Listener = (components: Component[]) => void;

// 用来存储Slot 与 Listener、Components的关系
type SlotMap = Map<string | symbol, { listeners: Listener[]; components: Component[] }>;
// 用来存储 Fill 与 Component 的关系
type FillMap = Map<ComponentInternalInstance, Component>;
// 管理 Slot 以及 Fill
export default class Manager {
    private eventBus: EventBus;
    private slotMap: SlotMap = new Map();
    private fillMap: FillMap = new Map();

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
    }

    didMount() {
        this.eventBus.on(DidMountEvent, this.childrenDidMount);
        this.eventBus.on(DidUpdateEvent, this.childrenDidUpdate);
        this.eventBus.on(WillUnmountEvent, this.childrenWillUnmount);
    }

    willUnmount() {
        this.eventBus.off(DidMountEvent, this.childrenDidMount);
        this.eventBus.off(DidUpdateEvent, this.childrenDidUpdate);
        this.eventBus.off(WillUnmountEvent, this.childrenWillUnmount);
    }

    addComponentsChangeListener(name: string | symbol, fn: Listener) {
        const isListened = this.slotMap.has(name);
        if (!isListened) {
            this.slotMap.set(name, {
                listeners: [],
                components: [],
            });
        }
        const slotInfo = this.slotMap.get(name)!;
        slotInfo.listeners.push(fn);
        fn(slotInfo.components);
    }

    removeComponentsChangeListener(name: string | symbol, fn: Listener) {
        const isListened = this.slotMap.has(name);
        if (!isListened) {
            return false;
        }
        const slotInfo = this.slotMap.get(name)!;
        slotInfo.listeners.splice(slotInfo.listeners.indexOf(fn), 1);
    }

    private childrenDidMount = (fill: ComponentInternalInstance) => {
        const children = fill.slots.default ? fill.slots.default : () => [];
        const name = fill.props.name as symbol;
        const component = { fill, children, name };

        const isListened = this.slotMap.has(name);
        if (!isListened) {
            this.slotMap.set(name, {
                listeners: [],
                components: [],
            });
        }
        const slotInfo = this.slotMap.get(name)!;
        slotInfo.components.push(component);
        slotInfo.listeners.forEach((fn) => fn(slotInfo.components));

        this.fillMap.set(fill, component);
    };
    private childrenDidUpdate = (fill: ComponentInternalInstance) => {
        const component = this.fillMap.get(fill);
        const children = fill.slots.default ? fill.slots.default : () => [];
        const name = fill.props.name as symbol;

        if (component) {
            component.children = children;

            const slotInfo = this.slotMap.get(name as symbol);
            if (slotInfo) {
                slotInfo.listeners.forEach((fn) => fn(slotInfo.components));
            } else {
                throw new Error(`Slot of name ${name.toString()} need to be defined`);
            }
        } else {
            throw new Error(`Slot of name ${name.toString()} need to be defined`);
        }
    };
    private childrenWillUnmount = (fill: ComponentInternalInstance) => {
        const component = this.fillMap.get(fill);
        const name = fill.props.name as symbol;

        if (!component) {
            throw new Error(`Slot of name ${name.toString()} need to be defined`);
        }

        const slotInfo = this.slotMap.get(name);
        if (!slotInfo) {
            throw new Error(`Slot of name ${name.toString()} need to be defined`);
        }

        let components = slotInfo.components;
        // 删除unmount 的 component
        components = components.filter((c) => c !== component);
        slotInfo.components = components;
        this.fillMap.delete(fill);

        if (slotInfo.listeners.length === 0 && components.length === 0) {
            this.slotMap.delete(name);
        } else {
            slotInfo.listeners.forEach((fn) => fn(components));
        }
    };
}
