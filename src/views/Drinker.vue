<template>
	<div class="drinker">
		<v-container fluid>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card>
						<v-card-title class="headline">
							Drinker Name
						</v-card-title>
						<v-card-text>
							<v-data-table
								:headers="tableHeaders"
								:items="tableRows" 
								hide-actions
								class="elevation-1"
							>
								<template slot="items" slot-scope="props">
									<td>{{ props.item.name }}</td>
									<td>{{ props.item.city }}</td>
									<td>{{ props.item.state }}</td>
									<td>{{ props.item.phone }}</td>
									<td>{{ props.item.addr }}</td>
								</template>
							</v-data-table>
							<Chart/>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import axios from "axios";
import Chart from "@/components/Chart.vue";

@Component({
	components: {
		Chart,
	},
})

export default class Drinker extends Vue {

	private tableHeaders: any[] = [
		{
			text: "Name",
			align: "left",
			sortable: false,
			value: "name",
		},
		{ text: "City", value: "city" },
		{ text: "State", value: "state" },
		{ text: "Phone", value: "phone" },
		{ text: "Address", value: "addr" },
	];

	private tableRows: any[] = [];

	private async setTableRows(): Promise<void> {
		let fullURL: string = "http://localhost:8081/something/something?q=";
		fullURL += encodeURIComponent("SELECT * FROM BarBeerDrinker.drinkers LIMIT 200");
		const response = await axios.get(fullURL);
		let results: any[] = [];
		if (response.status === 200) {
			const rows: any[] = response.data as any[];
			for (let row of rows) {
				const result = {
					value: false,
					name: row.name,
					city: row.city,
					state: row.state,
					phone: row.phone,
					addr: row.addr,
				}
				results.push(result); 
				console.log(result);
			}
			this.tableRows = results;
		} else {
			console.error("Failed to get data");
		}
	}

	private mounted() {
		this.setTableRows();
	}
}
</script>
