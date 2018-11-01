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
							<BarChart
								:labels="barChartLabels"
								:datasets="barChartData"
							/>
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
import BarChart from "@/components/BarChart.vue";

@Component({
	components: {
		BarChart,
	},
})

export default class Drinker extends Vue {

	private tableHeaders: any[] = [
		{
			text: "Name",
			align: "left",
			value: "name",
		},
		{ text: "City", value: "city" },
		{ text: "State", value: "state" },
		{ text: "Phone", value: "phone" },
		{ text: "Address", value: "addr" },
	];

	private tableRows: any[] = [];

	private barChartLabels: string[] = ["January", "February", "March", "April",
		"May", "June", "July", "August", "September",
		"October", "November", "December"];

	private barChartData: any[] = [
				{
					label: "GitHub Commits",
					backgroundColor: "#f87979",
					data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
				},
			];
	
	/**
	 * Show all drinker's transactions ordered by time and grouped by different bars
	 */
	private queryTrans(drinker: string): string {
		return `SELECT * FROM BarBeerDrinker.transaction t
				WHERE t.drinker = '${drinker}'
				ORDER BY t.bar, t.time;`;
	}

	/**
	 * Show all drinker's items by what the drinker orders the most
	 */
	private queryOrdersMost(drinker: string): string {
		return `SELECT item, item_type, amount FROM
				(SELECT bc.item, COUNT(*) as amount
				FROM BarBeerDrinker.billContains bc
				WHERE bc.trans_id IN
				(SELECT t.trans_id FROM BarBeerDrinker.transaction t
				WHERE t.drinker = '${drinker}')
				GROUP BY bc.item
				ORDER BY amount DESC) i1
				LEFT JOIN BarBeerDrinker.items i2 ON i2.item_name = i1.item;`;
	}

	/**
	 * Show drinker's spending in different bars, on different dates/weeks/months
	 */
	private querySpending(drinker: string, day?: number): string {
		if (day) {
			return `SELECT *, SUM(t.total) as total_paid
					FROM BarBeerDrinker.transaction t
					WHERE t.drinker = '${drinker}' AND t.day = ${day}
					GROUP BY t.bar;`;
		} else {
			return `SELECT *, SUM(t.total) as total_paid
					FROM BarBeerDrinker.transaction t
					WHERE t.drinker = '${drinker}'
					GROUP BY t.bar;`;
		}
	}

	private async setTransactions(drinker: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent("SELECT * FROM BarBeerDrinker.drinkers LIMIT 200");
		const response = await axios.get(fullURL);
		const results: any[] = [];
		if (response.status === 200) {
			const rows: any[] = response.data as any[];
			for (const row of rows) {
				const result = {
					value: false,
					name: row.name,
					city: row.city,
					state: row.state,
					phone: row.phone,
					addr: row.addr,
				};
				results.push(result);
				console.log(result);
			}
			this.tableRows = results;
		} else {
			console.error("Failed to get data");
		}
	}

	private mounted() {
		this.setTransactions("Andrea Ho");
	}
}
</script>
