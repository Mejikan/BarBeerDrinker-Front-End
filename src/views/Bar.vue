<template>
<div>

    <v-toolbar color="blue" dark tabs>
        <v-subheader class="pa-0">Pick your bar</v-subheader>
        <v-autocomplete 
			v-model="bar" 
			:items="allBarNames" 
			label="All the Bars" 
			persistent-hint prepend-icon="mdi-city" 
			@change="getBarData"
			@keyup.enter="getBarData"
		>
            <v-slide-x-reverse-transition slot="append-outer" mode="out-in">
            </v-slide-x-reverse-transition>
        </v-autocomplete>

        <v-tabs 
			slot="extension" 
			v-model="tabs" 
			centered color="transparent" 
			slider-color="white">
            <v-tab 
				:key="1"
				@change="getBarData"
			>
                	Most Valued Customers
            </v-tab>
            <v-tab 
				:key="2"
				@change="getBarData"
			>
                	Top Selling Beers
            </v-tab>
			 <v-tab 
				:key="3"
				@change="getBarData"
			>
                	Top Selling Manufacturers
            </v-tab>
            <v-tab 
				:key="4"
				@change="getBarData"
			>
                	High Volume Days
            </v-tab>
            <v-tab 
				:key="5"
				@change="getBarData"
			>
                	High Volume Hours
            </v-tab>
        </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tabs">
        <v-tab-item :key="1">
            <v-card>
				<v-card-title>
				</v-card-title>
				<v-card-text>
					<BarChart
						:chartData="mvDrinkersChartData"
						:options="mvDrinkersChartOptions"
					/>
				</v-card-text>
			</v-card>
        </v-tab-item>
        <v-tab-item :key="2">
            <v-card>
				<v-card-title>
				</v-card-title>
				<v-card-text>
					<BarChart
						:chartData="mvBeersChartData"
						:options="mvBeersChartOptions"
					/>
				</v-card-text>
			</v-card>
        </v-tab-item>
        <v-tab-item :key="3">
            <v-card>
				<v-card-title>
				</v-card-title>
				<v-card-text>
					<BarChart
						:chartData="mvManufacturersChartData"
						:options="mvManufacturersChartOptions"
					/>
				</v-card-text>
			</v-card>
        </v-tab-item>
		<v-tab-item :key="4">
            <v-card>
				<v-card-title>
				</v-card-title>
				<v-card-text>
					<BarChart
						:chartData="mvTimesChartData"
						:options="mvTimesChartOptions"
					/>
				</v-card-text>
			</v-card>
        </v-tab-item>
		<v-tab-item :key="5">
            <v-card>
				<v-card-title>
				</v-card-title>
				<v-card-text>
					<BarChart
						:chartData="mvTimesChartData2"
						:options="mvTimesChartOptions2"
					/>
				</v-card-text>
			</v-card>
        </v-tab-item>
    </v-tabs-items>
    <!-- <v-btn @click="getStuff" color="success">Success</v-btn> -->
	<v-btn
		round
		large
		color="orange accent-2 white--text"
		bottom
		left
		fixed
		to="/interface?modify=1"
	>
		Add Transaction
		<v-icon>add</v-icon>
	</v-btn>
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

export default class Bar extends Vue {
	private tabs: any = null;

	private allBarNames: string[] = [];
	private bar: any = null;
	private mvDrinkersChartData: any = {};

	private mvDrinkersChartOptions: any = {
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

	private mvBeersChartData: any = {};

	private mvBeersChartOptions: any = {
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

	private mvManufacturersChartData: any = {};

	private mvManufacturersChartOptions: any = {
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

	private mvTimesChartData: any = {};

	private mvTimesChartOptions: any = {
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

	private mvTimesChartData2: any = {};

	private mvTimesChartOptions2: any = {
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

	private dayNumber(dayNumber: number ): string {
		let result: string = "";
		if (dayNumber === 1) {
			result = "Sunday";
		} else if (dayNumber === 2) {
			result = "Monday";
		} else if (dayNumber === 3) {
			result = "Tuesday";
		} else if (dayNumber === 4) {
			result = "Wednesday";
		} else if (dayNumber === 5) {
			result = "Thursday";
		} else if (dayNumber ===  6) {
			result = "Friday";
		} else if (dayNumber === 7) {
			result = "Saturday";
		} else {
			result = "Day Readable";
		}
		return result;
	}

	private queryTopSpenders(Bar1: string): string {
		console.log(Bar1);
		return `Select drinker, sum(total) as running_total
				FROM BarBeerDrinker.transactions t
				WHERE t.bar = "${Bar1}"
				GROUP BY t.drinker
				order by running_total desc
				LIMIT 10`;
	}

	private queryTopBeers(Bar2: string): string {
		return `SELECT b.item, count(b.item) as count
				FROM BarBeerDrinker.billContains as b, BarBeerDrinker.items as i
				WHERE
					i.item_name = b.item &&
					i.item_type = "beer" &&
					b.trans_id in
						(SELECT t.trans_id
						FROM BarBeerDrinker.transactions as t
						WHERE t.bar = "${Bar2}")
				group by b.item
				order by count desc
				LIMIT 10`;
	}

	private queryTopManufacturers(Bar3: string): string {
		return `SELECT i.manufacturer, count(b.item) as count
				FROM BarBeerDrinker.billContains as b, BarBeerDrinker.items as i
				WHERE
					i.item_name = b.item &&
					i.item_type = "beer" &&
					b.trans_id in
						(
						SELECT t.trans_id
						FROM BarBeerDrinker.transactions as t
						WHERE t.bar = "${Bar3}"
						)
				group by i.manufacturer
				order by count desc
				LIMIT 10`;
	}

	private queryTopTimes(Bar4: string): string {
		return `SELECT
					t.day,
					sum(t.total) as Revenue
				FROM BarBeerDrinker.transactions t
				WHERE t.bar = "${Bar4}"
				group by t.day
				order by Revenue desc`;
					}

	private queryTopTimes2(Bar5: string): string {
		return `SELECT
					hour(time(t.date)) as hour,
					sum(t.total) as Revenue
				FROM BarBeerDrinker.transactions as t
				WHERE t.bar = "${Bar5}"
				GROUP BY hour
				ORDER BY Revenue desc`;
				}

	private async setUpTopSpenders(bar: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(this.queryTopSpenders(this.bar));
		const response = await axios.get(fullURL);
		if (response.status === 200) {
			console.log(response.data);

			const rows: any[] = response.data as any[];
			const drinkerNames: string[] = [];
			const drinkerSpendingTotal: number[] = [];
			for (const row of rows) {
				drinkerNames.push(row.drinker);
				drinkerSpendingTotal.push(row.running_total);
			}
			this.mvDrinkersChartData = {
				labels: drinkerNames,
				datasets: [
					{
						label: "This patron's total spending",
						backgroundColor: "rgba(0, 127, 255, 0.65)",
						data: drinkerSpendingTotal,
					},
				],
			};
		} else {
		console.error("Failed to get data");
		}
	}

	private async setUpTopBeers(bar: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(this.queryTopBeers(this.bar));
		const response = await axios.get(fullURL);
		if (response.status === 200) {
			console.log(response.data);

			const rows: any[] = response.data as any[];
			const beerNames: string[] = [];
			const beerCount: number[] = [];
			for (const row of rows) {
				beerNames.push(row.item);
				beerCount.push(row.count);
			}
			this.mvBeersChartData = {
				labels: beerNames,
				datasets: [
					{
						label: "Number sold of this beer",
						backgroundColor: "rgba(0, 127, 255, 0.65)",
						data: beerCount,
					},
				],
			};
		} else {
		console.error("Failed to get data");
		}
	}

	private async setUpTopManufacturers(bar: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(this.queryTopManufacturers(this.bar));
		const response = await axios.get(fullURL);
		if (response.status === 200) {
			console.log(response.data);

			const rows: any[] = response.data as any[];
			const manufacturerNames: string[] = [];
			const manufacturerCount: number[] = [];
			for (const row of rows) {
				manufacturerNames.push(row.manufacturer);
				manufacturerCount.push(row.count);
			}
			this.mvManufacturersChartData = {
				labels: manufacturerNames,
				datasets: [
					{
						label: "Number of Beers per Manufacturer",
						backgroundColor: "rgba(0, 127, 255, 0.65)",
						data: manufacturerCount,
					},
				],
			};
		} else {
		console.error("Failed to get data");
		}
	}

	private async setUpTopTimes(bar: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(this.queryTopTimes(this.bar));
		const response = await axios.get(fullURL);
		if (response.status === 200) {
			console.log(response.data);

			const rows: any[] = response.data as any[];
			const barDay: string[] = [];
			const barRevenue: number[] = [];
			for (const row of rows) {
				barDay.push(this.dayNumber(row.day));
				barRevenue.push(row.Revenue);
			}
			this.mvTimesChartData = {
				labels: barDay,
				datasets: [
					{
						label: "Revenue per day",
						backgroundColor: "rgba(0, 127, 255, 0.65)",
						data: barRevenue,
					},
				],
			};
		} else {
		console.error("Failed to get data");
		}
	}

	private async setUpTopTimes2(bar: string): Promise<void> {
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		console.log(this.queryTopTimes2(this.bar));
		fullURL += encodeURIComponent(this.queryTopTimes2(this.bar));
		const response = await axios.get(fullURL);
		if (response.status === 200) {
			console.log(response.data);

			const rows: any[] = response.data as any[];
			const barHour: string[] = [];
			const barRevenue: number[] = [];
			for (const row of rows) {
				barHour.push(row.hour);
				barRevenue.push(row.Revenue);
			}
			this.mvTimesChartData2 = {
				labels: barHour,
				datasets: [
					{
						label: "Revenue per specific hour (24 hour time)",
						backgroundColor: "rgba(0, 127, 255, 0.65)",
						data: barRevenue,
					},
				],
			};
		} else {
		console.error("Failed to get data");
		}
	}

	private async getBarData(): Promise<void> {
		this.setUpTopSpenders(this.bar);
		this.setUpTopBeers(this.bar);
		this.setUpTopManufacturers(this.bar);
		this.setUpTopTimes(this.bar);
		this.setUpTopTimes2(this.bar);
	}

	private async retrieveAllBarNames() {
		const q = `SELECT name FROM BarBeerDrinker.bars;`;
		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(q);
		const response = await axios.get(fullURL);
		const results: any[] = [];
		if (response.status === 200) {
			const rows: any[] = response.data as any[];
			for (const row of rows) {
				results.push(row.name);
			}
			this.allBarNames = results;
		}
	}

	private async mounted() {
		await this.retrieveAllBarNames();
		if (this.$route.params.name) {
			this.bar = this.$route.params.name;
			if (this.bar.trim().length > 0) {
				this.getBarData();
			}
		}
	}
}
</script>
