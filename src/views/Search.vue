<template>
	<div class="search">				
		<v-select
			:items= "items"
			label= "Standard"
			@change= "valueCallback"
			v-model= "selection"
		></v-select>
		<v-select
			:items="items"
			box
			label="Box style"
		></v-select>
		<v-select
			:items="items"
			label="Outline style"
			outline
		></v-select>

		<v-select
			:items="items"
			label="Solo field"
			solo
		></v-select>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

import { Env } from "@/env";

@Component({
	components: {
	},
})

export default class Search extends Vue {

	private items: string[] = ["Foo", "Bar", "Fizz", "Buzz"];
	private selection: string = "foo";
	private mounted() {
		//
	}
	private async valueCallback() {
		console.log(this.selection);
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent("SELECT * from BarBeerDrinker.bars");
		const queryGet = await axios.get(fullURL);
		console.log(queryGet);
	}
}
</script>
