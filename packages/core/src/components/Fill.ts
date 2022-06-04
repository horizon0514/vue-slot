import { defineComponent, onMounted, onUpdated, onUnmounted, getCurrentInstance } from 'vue';
import { useCustomer } from '../context';
import { DidMountEvent, DidUpdateEvent, WillUnmountEvent } from '../EventTypes';

type Key = string | number | symbol;
export interface FillProps {
    /** name 需要与 Slot 的 name 对应，建议使用 Symbol */
    name: string | symbol;
    /** Fill 是否独占 Slot, 默认为 false */
    exclusive?: boolean;
    /** Fill 的 render 顺序，renderOrder大的在前面渲染 默认为 0 */
    renderOrder?: number;
    /** Fill 的renderKey，会添加到 Fill 的children上 */
    renderKey?: Key;
    [key: string]: any;
}

/**
 * 定义填充。只支持不具名填充。
 *
 * 使用方法：
 * ```tsx
 * <div>
 * 	<Fill name="slot1" renderOrder={1} renderKey={'key-1'}>
 * 		<YourComponent />
 * 	</Fill>
 * <!-- 独占 Slot -->
 * 	<Fill name="slot1" exclusive>
 * 		<YourComponent />
 * 	</Fill>
 * </div>
 * ```
 */
export const Fill = defineComponent({
    props: ['name', 'exclusive', 'renderOrder', 'renderKey'],
    setup(_props: FillProps) {
        const context = useCustomer();
        onMounted(() => {
            const target = getCurrentInstance()!;
            context.eventBusSession.emit(DidMountEvent, target);
        });
        onUpdated(() => {
            const target = getCurrentInstance()!;
            context.eventBusSession.emit(DidUpdateEvent, target);
        });
        onUnmounted(() => {
            const target = getCurrentInstance()!;
            context.eventBusSession.emit(WillUnmountEvent, target);
        });

        return () => null;
    },
});
