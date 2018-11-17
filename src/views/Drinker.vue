<template>
	<div class="drinker">
		<v-container fluid>
			<v-layout row wrap>
				<v-flex xs12 lg10 offset-lg1>
					<v-toolbar
						tabs
						>
						<v-layout justify-center row wrap>
							<v-flex xs12 md8 lg6>
								<v-autocomplete
									v-model="drinker"
									:items="allDrinkerNames"
									placeholder="Enter a drinker's name and press enter"
									solo
									@keyup.enter="retrieveDrinkerData"
									@change="retrieveDrinkerData"					
								></v-autocomplete>
							</v-flex>
							<v-flex xs12 md2 lg1>
								<v-btn
									v-show="!retreivingData"
									large
									color="primary"
									:disabled="!allowQuery"
									@click="retrieveDrinkerData"
								>
									<v-icon>
										search
									</v-icon>
								</v-btn>
								<v-progress-circular
									v-show="retreivingData"
									indeterminate
									color="primary"
									class="mx-3 mt-2"
								></v-progress-circular>
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
											<td>{{ props.item.date.toLocaleTimeString() }}</td>
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
									<v-layout row justify-space-between>
										<v-flex>
											<v-menu
												:close-on-content-click="false"
												v-model="showBeginDatePicker"
												lazy
												transition="scale-transition"
												offset-y
												min-width="290px"
											>
												<v-text-field
													slot="activator"
													v-model="spendBeginDate"
													label="Start Date"
													readonly
												></v-text-field>
												<v-date-picker v-model="spendBeginDate" @input="onBeginDatePicked"></v-date-picker>
											</v-menu>
										</v-flex>
										<v-flex>
											<v-menu
												:close-on-content-click="false"
												v-model="showEndDatePicker"
												lazy
												transition="scale-transition"
												offset-y
												min-width="290px"
											>
												<v-text-field
													slot="activator"
													v-model="spendEndDate"
													label="End Date"
													readonly
												></v-text-field>
												<v-date-picker v-model="spendEndDate" @input="onEndDatePicked"></v-date-picker>
											</v-menu>
										</v-flex>
									</v-layout>
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
	private lastQuery: string = "";
	private retreivingData: boolean = false;
	private get allowQuery(): boolean {
		if (!this.drinker || this.drinker.trim().length < 1) {
			return false;
		}
		if (this.drinker === this.lastQuery) {
			return false;
		}
		if (this.retreivingData) {
			return false;
		}
		return true;
	}

	private formValid: boolean = true;

	private tableHeaders: any[] = [
		{ text: "Bar", value: "bar" },
		{ text: "Time", value: "date" },
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

	private spendingData: any = [];
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

	private spendBeginDate_: Date = new Date(2014, 0, 1);
	private spendEndDate_: Date = new Date();
	private showBeginDatePicker: boolean = false;
	private showEndDatePicker: boolean = false;

	private get spendBeginDate(): string {
		return this.spendBeginDate_.toISOString().substring(0, 10);
	}
	private set spendBeginDate(val: string) {
		this.spendBeginDate_ = new Date(val);
	}

	private get spendEndDate(): string {
		return this.spendEndDate_.toISOString().substring(0, 10);
	}
	private set spendEndDate(val: string) {
		this.spendEndDate_ = new Date(val);
	}

	/**
	 * Show all drinker's transactions ordered by time and grouped by different bars
	 */
	private queryTrans(drinker: string): string {
		return `SELECT * FROM BarBeerDrinker.transactions t
				WHERE t.drinker = '${drinker}'
				ORDER BY t.bar, t.date;`;
	}

	/**
	 * Show all drinker's items by what the drinker orders the most
	 */
	private queryOrdersMost(drinker: string): string {
		return `SELECT item, item_type, amount FROM
				(SELECT bc.item, COUNT(*) as amount
				FROM BarBeerDrinker.billContains bc
				WHERE bc.trans_id IN
				(SELECT t.trans_id FROM BarBeerDrinker.transactions t
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
			return `SELECT t.bar, t.date, SUM(t.tip) as sum_tip, SUM(t.total) as sum_total
					FROM BarBeerDrinker.transactions t
					WHERE t.drinker = '${drinker}' AND t.day = ${day}
					GROUP BY t.bar;`;
		} else {
			return `SELECT t.bar, t.date, SUM(t.tip) as sum_tip, SUM(t.total) as sum_total
					FROM BarBeerDrinker.transactions t
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
					date: new Date(row.date),
					day: parseInt(row.day, 10),
					bar: row.bar,
					drinker: row.drinker,
					tip: parseFloat(row.tip),
					total: parseFloat(row.total),
				};
				// find sorted position
				if (results.length < 1) {
					results.push(result);
				} else {
					for (let n = results.length - 1; n >= 0; n--) {
						const probe = results[n];
						const probeTime = new Date(0, 0, 0, probe.date.getHours(), probe.date.getMinutes(), probe.date.getSeconds());
						const resultTime = new Date(0, 0, 0, result.date.getHours(), result.date.getMinutes(), result.date.getSeconds());
						const timeless = probeTime.getTime() < resultTime.getTime();
						if (n === 0 && !timeless) {
							results.splice(0, 0, result);
							break;
						}
						if (probe.bar !== result.bar || timeless || n === 0) {
							results.splice(n + 1, 0, result);
							break;
						}
					}
				}
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
			this.spendingData = rows;
			this.setSpendingChart();
		} else {
			console.error("Failed to get data");
		}
	}

	private setSpendingChart() {
		const bars: string[] = [];
		const tips: number[] = [];
		const totals: number[] = [];
		for (const row of this.spendingData) {
			const date = new Date(row.date);
			if (date >= this.spendBeginDate_ && date <= this.spendEndDate_) {
				bars.push(row.bar);
				const tip: number = parseFloat(row.sum_tip);
				const total: number = parseFloat(row.sum_total);
				tips.push(tip);
				totals.push(total);
			}
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
	}

	private onBeginDatePicked() {
		this.showBeginDatePicker = false;
		this.setSpendingChart();
	}

	private onEndDatePicked() {
		this.showEndDatePicker = false;
		this.setSpendingChart();
	}

	private async retrieveDrinkerData(): Promise<void> {
		this.retreivingData = true;
		this.lastQuery = this.drinker;
		await Promise.all([this.setTransactions(this.drinker),
			this.setCommonOrders(this.drinker),
			this.setSpending(this.drinker),
		]);
		this.retreivingData = false;
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
