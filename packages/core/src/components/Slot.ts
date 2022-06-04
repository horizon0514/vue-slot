// 定义插槽

import {
    defineComponent,
    onMounted,
    onUnmounted,
    VNode,
    ComponentInternalInstance,
    reactive,
    cloneVNode,
    Slot as SlotType,
} from 'vue';
import { useCustomer } from '../context';

export interface SlotProps {
    name: string | symbol;
}

export interface Component {
    name: string | symbol;
    fill: ComponentInternalInstance;
    children: SlotType;
}

/**
 * 定义插槽。
 * 只支持不具名插槽。
 *
 * 使用方法：
 *
 * 所有 Fill name 为 `slot1` 的会填充到此处
 * ```tsx
 * <div>
 * 	<Slot name="slot1"></Slot>
 * </div>
 * ```
 */
export const Slot = defineComponent<SlotProps>({
    setup(props: SlotProps) {
        const context = useCustomer();
        const components = reactive<Component[]>([]);

        onMounted(() => {
            context.manager.addComponentsChangeListener(props.name, handleComponentsChange);
        });
        onUnmounted(() => {
            context.manager.removeComponentsChangeListener(props.name, handleComponentsChange);
        });

        function handleComponentsChange(cs: Component[]) {
            cs.forEach((c) => {
                if (!components.includes(c)) {
                    components.push(c);
                }
            });
        }

        return () => {
            const elements: VNode[] = [];
            const hasExclusived = components.some((c) => c.fill.props.exclusive);

            let filterComponents = components;
            // 假设有exclusive的fill，要剔除掉其余的fill
            if (hasExclusived) {
                filterComponents = filterComponents.filter((c) => c.fill.props.exclusive) || [];
            }

            filterComponents
                .sort((a, b) => {
                    const renderOrderA = Number(a.fill.props.renderOrder || 0);
                    const renderOrderB = Number(b.fill.props.renderOrder || 0);
                    return renderOrderB - renderOrderA;
                })
                .forEach((component) => {
                    const { children } = component;
                    (children() as VNode[]).forEach((child) => {
                        elements.push(cloneVNode(child));
                    });
                });
            return elements;
        };
    },
});