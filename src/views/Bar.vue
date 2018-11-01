<template>
	<div class="bar">
		<v-container fluid>
			<v-layout row wrap>
				<v-flex xs12>
					<v-card>
						<v-card-title class="headline">
							Bar Name
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
									<td>{{ props.item.addr }}</td>
									<td>{{ props.item.opens }}</td>
									<td>{{ props.item.closes }}</td>
									<td>{{ props.item.phone }}</td>
									<td>{{ props.item.day }}</td>
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
import { Env } from "@/env";
import Chart from "@/components/Chart.vue";

@Component({
	components: {
		Chart,
	},
})

export default class Bar extends Vue {

	private tableHeaders: any[] = [
		{
			text: "Name",
			align: "left",
			value: "name",
		},
		{ text: "City", value: "city" },
		{ text: "State", value: "state" },
		{ text: "Opens", value: "opens" },
		{ text: "Closes", value: "closes" },
		{ text: "Address", value: "addr" },
		{ text: "Phone", value: "phone" },
		{ text: "Day", value: "day" },
	];

	private tableRows: any[] = [];

	private async setTableRows(): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent("SELECT * FROM BarBeerDrinker.bars LIMIT 20");
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
					addr: row.addr,
					opens: row.opens,
					closes: row.closes,
					phone: row.phone,
					day: row.day,
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
