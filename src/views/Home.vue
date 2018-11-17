<template>
	<div class="home">
		<v-container fluid fill-height class="pa-0 ma-0">
			<v-carousel
				hide-controls
				hide-delimiters
				height="100%"
			>
				<v-carousel-item
					v-for="(item,i) in images"
					:key="i"
					:src="item.src"
					interval="8000"
				>
					<v-container fluid fill-height>
						<v-layout justify-center align-center>
							<div
								class="text-xs-center pa-3 white--text display-4 font-weight-bold title-font"
							>
								{{ greetings[i] }}
							</div>
						</v-layout>
					</v-container>
				</v-carousel-item>
			</v-carousel>
		</v-container>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
	components: {
	},
})
export default class Home extends Vue {
	private images: any[] = [
		{ src: require("@/assets/stock/beer-machine-alcohol-brewery-159291.jpeg") },
		{ src: require("@/assets/stock/bread-food-restaurant-people.jpg") },
		{ src: require("@/assets/stock/jause-eat-delicious-food-56007.jpeg") },
		{ src: require("@/assets/stock/pexels-photo-1128975.jpeg") },
		{ src: require("@/assets/stock/pexels-photo-1267359.jpeg") },
		{ src: require("@/assets/stock/pexels-photo-1283219.jpeg") },
	];

	private greetings: string[] = [
		"SATISFYING SERVICE",
		"EXCITING EXPERIENCES",
		"FASCINATING FOODS",
		"COMFORTING DRINKS",
		"WELL-AGED INVENTORY",
		"UNRIVALED SELECTION",
	];
}
</script>

<style lang="scss" scoped>
.title-font {
	background-color: rgba(128, 128, 128, 0.5)
}
</style>
