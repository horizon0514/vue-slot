// Provider,初始化Manager以及EventBusSession，向 children 注入 Context
import EventBus from 'events';
import { defineComponent, onUnmounted } from 'vue';
import Manager from '../manager';
import { createProvider } from '../context';

export const SlotProvider = defineComponent({
    setup(_props, { slots }) {
        const eventBus = new EventBus();
        const manager = new Manager(eventBus);
        const slotContext = { eventBusSession: eventBus, manager: manager };
        manager.didMount();
        createProvider(slotContext);

        onUnmounted(() => {
            manager.willUnmount();
        });

        return () => slots.default?.();
    },
});
