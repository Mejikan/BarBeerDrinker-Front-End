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
import Axios from "axios";

@Component({
	components: {
	},
})

export default class Search extends Vue {

	private items : string[] = ['Foo', 'Bar', 'Fizz', 'Buzz'] 
	private selection : string = 'foo'
	private mounted() {
		//
	}
	private async valueCallback() {
		console.log(this.selection)

	const queryGet = await Axios.get("http://localhost:8081/something/something")
	console.log(queryGet)
	}
}
</script>
