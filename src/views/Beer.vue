<template>
<div>

    <v-toolbar color="blue" dark tabs>
        <v-subheader class="pa-0">Pick your poison</v-subheader>
        <v-autocomplete 
			v-model="beer" 
			:items="allBeers" 
			label="All the Beers" 
			persistent-hint prepend-icon="mdi-city" 
			@change="getBeerData"
			@keyup.enter="getBeerData"
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
				@change="getBeerData"
			>
                	Top Sellers
            </v-tab>
            <v-tab 
				:key="2"
				@change="getBeerData"
			>
                	Top Drinkers
            </v-tab>
            <v-tab 
				:key="3"
				@change="getBeerData"
			>
                	High Volume Times
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
						:chartData="topSellersChartData"
						:options="topSellersChartOptions"
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
						:chartData="topDrinkersChartData"
						:options="topDrinkersChartOptions"
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
						:chartData="highVolumeTimesChartData"
						:options="highVolumeTimesChartOptions"
					/>
				</v-card-text>
			</v-card>
        </v-tab-item>
    </v-tabs-items>
    <!-- <v-btn @click="getStuff" color="success">Success</v-btn> -->
</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import BarChart from "@/components/BarChart.vue";
	import { Env } from "@/env";
	import axios from "axios";
	// import { defaultCoreCipherList } from "constants";

	@Component({
		components: {
			BarChart,
		},
	})

	export default class Beer extends Vue {
		private tabs: any = null;
		private isEditing: boolean = false;
		private beer: any = null;
		private allBeers: string[] = [];

		private topSellersChartData: any = {};

		private topSellersChartOptions: any = {
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

		private topDrinkersChartData: any = {};

		private topDrinkersChartOptions: any = {
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

		private highVolumeTimesChartData: any = {};

		private highVolumeTimesChartOptions: any = {
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

		private queryTopSellers(Beer1: string): string {
			return `SELECT T.bar, count(*) as count
				FROM BarBeerDrinker.transactions T
				where T.trans_id IN (
					SELECT B.trans_id FROM BarBeerDrinker.billContains B
					WHERE B.item = "${Beer1}")
				group by T.bar
				order by count(*) desc Limit 10`;
		}

		private queryTopDrinkerOfBeer(Beer2: string): string {
			return `SELECT T.drinker, count(*) as count
				FROM BarBeerDrinker.transactions T
				where T.trans_id IN	(
					SELECT B.trans_id
					FROM BarBeerDrinker.billContains B
					WHERE B.item = "${Beer2}")
				group by T.drinker
				order by count(*) desc limit 10`;
		}

		private queryWhenBeerSellsMost(Beer3: string): string {
			return `SELECT T.day, count(*) as count
				FROM BarBeerDrinker.transactions T
				where T.trans_id IN	(
					SELECT B.trans_id
					FROM BarBeerDrinker.billContains B
					WHERE B.item = "${Beer3}")
					group by T.day
					order by count(*) desc limit 10`;
		}

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

		private async setUpTopSellers(beer: string): Promise<void> {
			let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
			fullURL += encodeURIComponent(this.queryTopSellers(this.beer));
			const response = await axios.get(fullURL);
			if (response.status === 200) {
				console.log(response.data);

				const rows: any[] = response.data as any[];
				const barNames: string[] = [];
				const beerCount: number[] = [];
				for (const row of rows) {
					barNames.push(row.bar);
					beerCount.push(row.count);
				}
				this.topSellersChartData = {
					labels: barNames,
					datasets: [
						{
							label: "Bars",
							backgroundColor: "rgba(0, 127, 255, 0.65)",
							data: beerCount,
						},
					],
				};
			} else {
			console.error("Failed to get data");
			}
		}

		private async setUpTopDrinkers(beer: string): Promise<void> {
			let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
			fullURL += encodeURIComponent(this.queryTopDrinkerOfBeer(this.beer));
			const response = await axios.get(fullURL);
			if (response.status === 200) {
				console.log(response.data);
				const rows: any[] = response.data as any[];
				const drinkerNames: string[] = [];
				const beerCount: number[] = [];
				for (const row of rows) {
					drinkerNames.push(row.drinker);
					beerCount.push(row.count);
				}
				this.topDrinkersChartData = {
					labels: drinkerNames,
					datasets: [
						{
							label: "Drinkers",
							backgroundColor: "rgba(0, 127, 255, 0.65)",
							data: beerCount,
						},
					],
				};
			} else {
			console.error("Failed to get data");
			}		}

		private async setUpHighVolumeTimes(beer: string): Promise<void> {
			let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
			fullURL += encodeURIComponent(this.queryWhenBeerSellsMost(this.beer));
			const response = await axios.get(fullURL);
			if (response.status === 200) {
				console.log(response.data);
				const rows: any[] = response.data as any[];
				const peakTimes: string[] = [];
				const beerCount: number[] = [];
				let today: string = "";
				for (const row of rows) {
					today = this.dayNumber(parseInt(row.day, 10)) as string;
					peakTimes.push(today);
					beerCount.push(row.count);
				}
				this.highVolumeTimesChartData = {
					labels: peakTimes,
					datasets: [
						{
							label: "Peak Times",
							backgroundColor: "rgba(0, 127, 255, 0.65)",
							data: beerCount,
						},
					],
				};
			} else {
			console.error("Failed to get data");
			}		}

		private async getBeerData(): Promise<void> {
			this.setUpTopSellers(this.beer);
			this.setUpTopDrinkers(this.beer);
			this.setUpHighVolumeTimes(this.beer);
		}

		private async retrieveAllBeerNames() {
			const q = `SELECT item_name AS name FROM BarBeerDrinker.items WHERE item_type='beer';`;
			let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
			fullURL += encodeURIComponent(q);
			const response = await axios.get(fullURL);
			const results: any[] = [];
			if (response.status === 200) {
				const rows: any[] = response.data as any[];
				for (const row of rows) {
					results.push(row.name);
				}
				this.allBeers = results;
			}
		}

		private async mounted() {
			await this.retrieveAllBeerNames();
			if (this.$route.params.name) {
				this.beer = this.$route.params.name;
				if (this.beer.trim().length > 0) {
					this.getBeerData();
				}
			}
	}
}
</script>
