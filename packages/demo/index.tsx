import { Slot, SlotProvider } from 'vue-slot';
import { createApp, defineComponent } from 'vue';
import { Parent } from './Parent';
import { Child } from './Child';

const App = defineComponent({
	setup() {

		return () => (
			<SlotProvider>
				<div>vue slot</div>
				<Parent/>
				<Child/>
			</SlotProvider>
		);
	}
});

createApp(App).mount('#root');
