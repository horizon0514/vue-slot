import { Fill, } from 'vue-slot';
import { defineComponent } from 'vue';
import { SlotName } from './Parent';
const Child = defineComponent({
	setup() {
		return () => (
			<>
				<div>Fill container</div>
				<Fill name={SlotName}>
					<div>this will insert into slot container</div>
				</Fill>
			</>
		);
	}
});

export { Child };
