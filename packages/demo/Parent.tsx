import { Slot, } from 'vue-slot';
import { defineComponent } from 'vue';

const SlotName = Symbol('SlotName');

const Parent = defineComponent({
	setup() {

		return () => (
			<>
				<div>Slot container</div>
				<Slot name={SlotName}/>
			</>
		);
	}
});

export { Parent, SlotName };
