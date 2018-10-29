<template>
	<v-app>
		<v-toolbar app>
			<v-toolbar-title class="headline text-uppercase">
				<span>Liquor Insights </span>
				<span class="font-weight-light">A 336 PROJECT</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
				flat
				target="_blank"
			>
				<span class="mr-2">Drinker</span>
			</v-btn>
			<v-btn
				flat
				target="_blank"
			>
				<span class="mr-2">Bar</span>
			</v-btn>
			<v-btn
				flat
				target="_blank"
			>
				<span class="mr-2">Beer</span>
			</v-btn>
		</v-toolbar>

		<v-content>
			<HelloWorld/>
		</v-content>
	</v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
	name: "App",
	components: {
		HelloWorld,
	},
	data() {
		return {
			//
		};
	},
};
</script>
