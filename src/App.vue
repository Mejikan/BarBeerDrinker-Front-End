<template>
	<v-app :dark="useDark">
		<v-toolbar app>
			<v-toolbar-title class="headline text-uppercase">
				<span>Liquor Insights </span>
				<span class="font-weight-light">A 336 PROJECT</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
				flat
				to="/"
			>
				<span class="mr-2">Home</span>
			</v-btn>
			<v-btn
				flat
				to="/drinker"
			>
				<span class="mr-2">Drinker</span>
			</v-btn>
			<v-btn
				flat
				to="/bar"
			>
				<span class="mr-2">Bar</span>
			</v-btn>
			<v-btn
				flat
				to="/beer"
			>
				<span class="mr-2">Beer</span>
			</v-btn>
			<v-btn
				flat
				to="/search"
			>
				<span class="mr-2">Search</span>
			</v-btn>
			<v-menu offset-y>
				<v-btn
					fab
					flat
					slot="activator"
				>
					<v-icon>settings</v-icon>
				</v-btn>
				<v-card>
					<v-card-text>
					<h4>Toggle Theme</h4>
					<span>
						<v-switch right
							label="Dark Theme"
							v-model="useDark"
						></v-switch>
					</span>
					</v-card-text>
				</v-card>
			</v-menu>
		</v-toolbar>

		<v-content>
			<transition name="fade">
				<router-view></router-view>
			</transition>
		</v-content>

		<v-footer
			height="auto"
		>
			<v-container fluid grid-list-md><v-layout row wrap><v-flex xs12>
				<div class="text-xs-right">
					Group 32 | <strong>Kevin Toft and Lawrence Yong</strong>
					<v-spacer></v-spacer>
					&copy;{{ new Date().getFullYear() }}
				</div>
			</v-flex></v-layout></v-container>
		</v-footer>
	</v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
	components: {
	},
})
export default class App extends Vue {
	public useDark: boolean = false;
}
</script>
