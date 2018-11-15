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
				></v-carousel-item>
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
}
</script>
