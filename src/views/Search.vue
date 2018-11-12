<template>

	<div class="search">
		<v-container fluid grid-list-md>
			<v-layout row wrap>
			<v-flex xs12>
				<v-textarea id = "searchButton"
				outline
				name="input-7-4"
				label="Query Area"
				value=""				
				></v-textarea>
				<v-btn @click= "valueCallback">Execute
					
				</v-btn>
			</v-flex>
			</v-layout>
		</v-container>	
		<!-- <v-select
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
		></v-select> -->
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
		const textArea = document.getElementById("searchButton") as HTMLInputElement;
		const input = textArea.value;
		console.log(input);
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(input);
		const queryGet = await axios.get(fullURL);
		console.log(queryGet);
	}
}
</script>
