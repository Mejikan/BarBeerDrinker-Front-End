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
		private allBeers: string[] = ["077XX",
			"1492",
			"312 Urban Pale Ale",
			"312 Urban Wheat Ale",
			"543 Skull Creek Fresh Hopped Pale Ale",
			"Akari Shogun American Wheat Ale",
			"All American Blonde Ale",
			"American Red Porter",
			"Angry Orchard Crisp Apple",
			"Arjuna",
			"Arkansas Red",
			"Awry Rye Pale Ale",
			"Back East Ale",
			"Back in Black",
			"Barney Flats Oatmeal Stout",
			"Barrio Blanco",
			"Batch 69 IPA",
			"Beach Patrol",
			"Beasts A'Burnin'",
			"Beaver Logger",
			"Behemoth",
			"Bent Paddle Black Ale",
			"Big Elm IPA",
			"Big Star White IPA",
			"Bikini Beer",
			"Black Exodus",
			"Blonde Czich",
			"Blood Orange Honey",
			"Boy King",
			"Bozone Hefe Weizen",
			"Bring Back the Beach Blonde Ale",
			"Brotherhood Steam",
			"Brush Creek Blonde",
			"Burning Bush Smoked IPA",
			"Caldera IPA",
			"Category 3 IPA",
			"Cherny Bock",
			"Chugach Session Ale",
			"Churchkey Pilsner Style Beer",
			"Citra Ass Down",
			"Clean Shave IPA",
			"Cone Crusher",
			"Contemplation",
			"Copperhead Amber",
			"Coq D'Or",
			"Coq de la Marche",
			"Core Oatmeal Stout",
			"Country Boy IPA",
			"Cut Throat Pale Ale",
			"Dead Armadillo Amber Ale",
			"Deadicated Amber",
			"Devils Tramping Ground Tripel",
			"Divided Sky",
			"Dolores River ESB",
			"Double Brown Stout",
			"Dry Dock Amber Ale",
			"Dry Hard Apple Cider",
			"Dubbelicious",
			"Dundee Summer Wheat Beer",
			"East India Pale Ale",
			"Easy Livin' Summer Ale",
			"El Hefe Speaks",
			"Fall Hornin'",
			"Farmer Ted's Farmhouse Cream Ale",
			"Farmer Wirtz India Pale Ale",
			"Fearless Scottish Ale",
			"Field 41 Pale Ale",
			"Firewater India Pale Ale",
			"First Press",
			"Fisherman's Brew",
			"Flesh Gourd'n",
			"FMB 101",
			"Fort Pitt Ale",
			"Four String Vanilla Porter",
			"Freeride APA",
			"General George Patton Pilsner",
			"Ginja Ninja",
			"Good People Pale Ale",
			"Gossamer Golden Ale",
			"Great Crescent Belgian Style Wit",
			"Great Crescent Blonde Ale",
			"Great Crescent IPA",
			"Green Bullet Organic India Pale Ale",
			"Green Collar",
			"Greenbelt Farmhouse Ale",
			"Gutch English Style Mild Ale",
			"Gyptoberfest",
			"Hardcore Chimera",
			"Harvest Ale",
			"Heavy Lifting",
			"Heinnieweisse Weissebier",
			"Here Gose Nothin'",
			"Hop Stalker Fresh Hop IPA",
			"HopArt",
			"Hopkick Dropkick",
			"Hopportunity Knocks IPA",
			"Horny Toad Cerveza",
			"Incredible Pedal IPA",
			"Insert Hop Reference",
			"Jade",
			"Jalapeno Pale Ale",
			"Kaleidoscope Collaboration 2012",
			"Kilt Dropper Scotch Ale",
			"Little Boss",
			"Little Sister India Style Session Ale",
			"Live Local Golden Ale",
			"London Balling",
			"Lost Sailor IPA",
			"Lucky Buck",
			"Maduro Brown Ale",
			"MCA",
			"Mirror Pond Pale Ale",
			"Misty Mountain IPA",
			"Moe Lasses'",
			"Moose Drool Brown Ale",
			"Morning Wood",
			"Mountain Fairy Raspberry Wheat",
			"Mountain Livin' Pale Ale",
			"Naked Pig Pale Ale",
			"Newport Storm IPA",
			"Noche Dulce",
			"Norm's Raggedy Ass IPA",
			"North French",
			"Oak Cliff Coffee Ale",
			"Oatmeal PSA",
			"Oberon",
			"OktoberFiesta",
			"Old Detroit",
			"Orange Grove Wheat Ale",
			"Passion Fruit Prussia",
			"Pepper in the Rye",
			"Perzik Saison",
			"Pilot Rock Porter",
			"Plow Horse Belgian Style Imperial Stout",
			"Point the Way IPA",
			"Polar Pale Ale",
			"Pothole Stout",
			"Powder Hound Winter Ale",
			"Psychopomp",
			"Pumpkin Beast",
			"Quick WIT",
			"Quick Wit Belgianesque Ale",
			"Raincloud Robust Porter",
			"Rhode Island Blueberry",
			"Rod Bender Red",
			"Roller Dam Red Ale",
			"Rules are Rules",
			"Rye Pils Session Lager",
			"Rye Porter",
			"Saddle Bronc Brown Ale",
			"Samuel Adams Summer Ale",
			"Sankaty Light Lager",
			"Santa's Secret",
			"Saucy Intruder",
			"Sawtooth Ale",
			"Seiche Scottish Ale",
			"Sex and Candy",
			"Shark Tracker Light lager",
			"Single Engine Red",
			"Sky Blue Golden Ale",
			"Sky High Rye",
			"Solitude",
			"South Ridge Amber Ale",
			"Southern Drawl Pale Lager",
			"Star Runner",
			"Stone's Throw IPA",
			"Strawberry Blonde",
			"Sudice American Stout",
			"Summer Honey",
			"Suncaster Summer Wheat",
			"Tart Side of the Moon",
			"Tender Loving Empire NWPA",
			"Terrace Hill Double IPA",
			"The 26th",
			"The Citizen",
			"The Gadget",
			"The Grand Army",
			"The Lawn Ranger",
			"Thrasher Session India Pale Ale",
			"Toasted Lager",
			"Tree Bucket",
			"Trigger Blonde Ale",
			"Twisted Helles Summer Lager",
			"Underachiever",
			"Underdog Atlantic Lager",
			"Vanilla Java Porter",
			"Verdun",
			"Vertex IPA",
			"Vivant Tripel",
			"Wandering Pelican",
			"Watermelon Ale",
			"West Portal Colorado Common Summer Ale",
			"White Zombie Ale",
			"Whitsun",
			"Wolfman's Berliner",
			"Wrath of Pele",
			"Yo Soy Un Berliner",
		];

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
				FROM BarBeerDrinker.transaction T
				where T.trans_id IN (
					SELECT B.trans_id FROM BarBeerDrinker.billContains B
					WHERE B.item = "${Beer1}")
				group by T.bar
				order by count(*) desc Limit 10`;
		}

		private queryTopDrinkerOfBeer(Beer2: string): string {
			return `SELECT T.drinker, count(*) as count
				FROM BarBeerDrinker.transaction T
				where T.trans_id IN	(
					SELECT B.trans_id
					FROM BarBeerDrinker.billContains B
					WHERE B.item = "${Beer2}")
				group by T.drinker
				order by count(*) desc limit 10`;
		}

		private queryWhenBeerSellsMost(Beer3: string): string {
			return `SELECT T.day, count(*) as count
				FROM BarBeerDrinker.transaction T
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

		private mounted() {
		if (this.$route.params.name) {
			this.beer = this.$route.params.name;
			if (this.beer.trim().length > 0) {
				this.getBeerData();
			}
		}
	}
}
</script>
