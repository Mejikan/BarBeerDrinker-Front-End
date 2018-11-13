<template>

	<div class="search">
		<v-container fluid grid-list-md>
			<v-layout row wrap>
			<v-flex xs12>
				<v-textarea id = "searchButton"
				outline
				name="input-7-4"
				label="Search Area"
				value=""				
				></v-textarea>
				<v-btn @click= "valueCallback">Execute
				</v-btn>
			</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

import { Env } from "@/env";
import { colors } from "vuetify/lib";

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
		// console.log(input);
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(input);
		const queryGet = await axios.get(fullURL);
		console.log(queryGet);
		// const columnList = queryGet.data;
		// console.log(columnList);
	}
}
</script>
