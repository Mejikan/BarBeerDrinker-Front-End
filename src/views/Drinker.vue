<template>
	<div class="drinker">
		<v-container fluid>
			<v-layout row wrap>
				<v-flex xs12>
					<v-subheader v-show="currentDrinker.length > 0">
						Displaying data for {{ currentDrinker }}
					</v-subheader>
					<v-toolbar
						tabs
						>
						<v-layout justify-center>
							<v-flex xs12 lg6>
								<v-autocomplete
									v-model="drinker"
									:items="allDrinkerNames"
									placeholder="Enter a drinker's name and press enter"
									persistent-hint
									append-icon="search"
									solo
									@click:append="retrieveDrinkerData"
									@keyup.enter="retrieveDrinkerData"									
								></v-autocomplete>
							</v-flex>
						</v-layout>

						<v-tabs
							slot="extension"
							v-model="tabs"
							centered
							color="transparent"
							>
							<v-tab :key="1">
								Transactions
							</v-tab>
							<v-tab :key="2">
								Most Ordered
							</v-tab>
							<v-tab :key="3">
								Spending
							</v-tab>
						</v-tabs>
					</v-toolbar>

					<v-tabs-items v-model="tabs">
						<v-tab-item :key="1">
							<v-card>
								<v-card-title>
								</v-card-title>
								<v-card-text>
									<v-data-table
										:headers="tableHeaders"
										:items="tableRows" 
										hide-actions
										class="elevation-1"
									>
										<template slot="items" slot-scope="props">
											<td>{{ props.item.bar }}</td>
											<td>{{ props.item.day }}</td>
											<td>{{ props.item.time }}</td>
											<td>{{ props.item.trans_id }}</td>
											<td>${{ props.item.total.toFixed(2) }}</td>
											<td>${{ props.item.tip.toFixed(2) }}</td>
										</template>
									</v-data-table>
								</v-card-text>
							</v-card>
						</v-tab-item>
						<v-tab-item :key="2">
							<v-card>
								<v-card-title>
								</v-card-title>
								<v-card-text>
									<BarChart
										:chartData="mostOrderChartData"
										:options="mostOrderChartOptions"
									/>
								</v-card-text>
							</v-card>
						</v-tab-item>
						<v-tab-item :key="3">
							<v-card>
								<v-card-title>
								</v-card-title>
								<v-card-text>
									<HorzBarChart
										:chartData="spendingChartData"
										:options="spendingChartOptions"
									/>
								</v-card-text>
							</v-card>
						</v-tab-item>
					</v-tabs-items>

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
import HorzBarChart from "@/components/HorzBarChart.vue";
import * as drinkerNames from "@/sql/drinkers.json";

@Component({
	components: {
		BarChart,
		HorzBarChart,
	},
})

export default class Drinker extends Vue {
	private allDrinkerNames: string[] = drinkerNames.drinkers;

	private tabs: any = null;

	private drinker: string = "";

	/** The drinker whose data is currently display. */
	private currentDrinker: string = "";

	private formValid: boolean = true;

	private tableHeaders: any[] = [
		{
			text: "Bar",
			align: "left",
			value: "bar",
		},
		{ text: "Day", value: "day" },
		{ text: "Time", value: "time" },
		{ text: "Transaction ID", value: "trans_id" },
		{ text: "Total", value: "total" },
		{ text: "Tip", value: "tip" },
	];

	private tableRows: any[] = [];

	private mostOrderChartData: any = {};

	private mostOrderChartOptions: any = {
			responsive: true,
			maintainAspectRatio: true,
			scales: {
				xAxes: [
					{
						ticks: { autoSkip: false },
					},
				],
				yAxes: [
					{
						ticks: { beginAtZero: true },
					},
				],
			},
		};

	private spendingChartData: any = {};

	private spendingChartOptions: any = {
			responsive: true,
			maintainAspectRatio: true,
			scales: {
				xAxes: [
					{
						ticks: { autoSkip: false },
						stacked: true,
					},
				],
				yAxes: [
					{
						ticks: { beginAtZero: true },
						stacked: true,
					},
				],
			},
		};

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
			return `SELECT t.bar, SUM(t.tip) as sum_tip, SUM(t.total) as sum_total
					FROM BarBeerDrinker.transaction t
					WHERE t.drinker = '${drinker}' AND t.day = ${day}
					GROUP BY t.bar;`;
		} else {
			return `SELECT t.bar, SUM(t.tip) as sum_tip, SUM(t.total) as sum_total
					FROM BarBeerDrinker.transaction t
					WHERE t.drinker = '${drinker}'
					GROUP BY t.bar;`;
		}
	}

	private async setTransactions(drinker: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(this.queryTrans(drinker));
		const response = await axios.get(fullURL);
		const results: any[] = [];
		if (response.status === 200) {
			const rows: any[] = response.data as any[];
			for (const row of rows) {
				const result = {
					value: false,
					trans_id: parseInt(row.trans_id, 10),
					day: parseInt(row.day, 10),
					time: row.time,
					bar: row.bar,
					drinker: row.drinker,
					tip: parseFloat(row.tip),
					total: parseFloat(row.total),
				};
				results.push(result);
				// console.log(result); // debug
			}
			this.tableRows = results;
		} else {
			console.error("Failed to get data");
		}
	}

	private async setCommonOrders(drinker: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(this.queryOrdersMost(drinker));
		const response = await axios.get(fullURL);
		if (response.status === 200) {
			const rows: any[] = response.data as any[];

			const beerNames: string[] = [];
			const beerCount: number[] = [];
			const foodNames: string[] = [];
			const foodCount: number[] = [];
			for (const row of rows) {
				if (row.item_type === "beer") { // filter beer
					beerNames.push(row.item);
					beerCount.push(parseInt(row.amount, 10));
				} else if (row.item_type === "food") { // filter food
					foodNames.push(row.item);
					foodCount.push(parseInt(row.amount, 10));
				}
			}
			this.mostOrderChartData = {
				labels: beerNames,
				datasets: [
					{
						label: "Beers",
						backgroundColor: "rgba(0, 127, 255, 0.65)",
						data: beerCount,
					},
				],
			};
		} else {
			console.error("Failed to get data");
		}
	}

	private async setSpending(drinker: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(this.querySpending(drinker));
		const response = await axios.get(fullURL);
		if (response.status === 200) {
			const rows: any[] = response.data as any[];

			const bars: string[] = [];
			const tips: number[] = [];
			const totals: number[] = [];
			for (const row of rows) {
				bars.push(row.bar);
				const tip: number = parseFloat(row.sum_tip);
				const total: number = parseFloat(row.sum_total);
				tips.push(tip);
				totals.push(total);
			}
			this.spendingChartData = {
				labels: bars,
				datasets: [
					{
						label: "Paid (no tip)",
						backgroundColor: "rgba(255, 0, 0, 0.65)",
						data: totals,
					},
					{
						label: "Tip",
						backgroundColor: "rgba(192, 192, 0, 0.65)",
						data: tips,
					},
				],
			};
		} else {
			console.error("Failed to get data");
		}
	}

	private async retrieveDrinkerData(): Promise<void> {
		await Promise.all([this.setTransactions(this.drinker),
			this.setCommonOrders(this.drinker),
			this.setSpending(this.drinker),
		]);
		this.currentDrinker = this.drinker;
	}

	private mounted() {
		if (this.$route.params.name) {
			this.drinker = this.$route.params.name;
			if (this.drinker.trim().length > 0) {
				this.retrieveDrinkerData();
			}
		}
	}
}
</script>
