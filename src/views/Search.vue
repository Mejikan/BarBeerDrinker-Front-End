<template>
	<div class="search">
		<v-container fluid grid-list-xs>
			<v-layout row wrap>
				<v-flex xs12 lg4 class="px-2 pb-2">
					<v-card>
						<v-card-title class="title">
							BarBeerDrinker Tables
							<v-spacer></v-spacer>
							<v-tooltip bottom>
								<v-btn
									fab
									small
									slot="activator"
									class="info ma-0"
									@click="showER"
								>
									<v-icon>launch</v-icon>
								</v-btn>
								<span>Open ER Diagram</span>
							</v-tooltip>
						</v-card-title>
						<v-card-text>
							<v-treeview
								:items="schema"
								transition
								open-on-click
							></v-treeview>
						</v-card-text>
					</v-card>
				</v-flex>
				<v-flex xs12 lg8>
					<v-card>
						<v-card-text>
							<v-subheader>Query Input</v-subheader>
							<v-textarea 
								v-model="query"
								auto-grow
								autofocus
								solo
								append-icon="clear"
								@click:append="clearQueryInput"
							></v-textarea>
							<v-subheader>Query Response</v-subheader>
							<v-textarea 
								v-model="dbMessage"
								auto-grow
								readonly
								outline
							></v-textarea>
						</v-card-text>
						<v-card-actions>
							<div v-show="!allowQuery">
								<span>Executing query...</span>
								<v-progress-circular
									class="mx-2"
									indeterminate
									color="primary"
								></v-progress-circular>
							</div>
							<v-spacer></v-spacer>
							<v-btn
								:disabled="!allowQuery"
								class="primary"
								@click="valueCallback">
								Execute
								<v-icon class="ml-2">
									send
								</v-icon>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
				<v-flex xs12>
					<v-card v-show="dataRows.length > 0">
						<v-card-title class="title">
							RESULTS
							<v-spacer></v-spacer>
							<v-tooltip bottom>
								<v-btn
									fab
									small
									slot="activator"
									class="green white--text my-0"
									@click="exportCSV"
								>
									<v-icon>mdi-table-large</v-icon>
								</v-btn>
								<span>Export CSV</span>
							</v-tooltip>
							<v-tooltip bottom>
								<v-btn
									fab
									small
									slot="activator"
									class="purple white--text my-0"
									@click="exportJSON"
								>
									<v-icon>mdi-json</v-icon>
								</v-btn>
								<span>Export JSON</span>
							</v-tooltip>
						</v-card-title>
						<v-data-table
							v-show="dataRows.length > 0"
							:headers="dataHeaders"
							:items="dataRows"
							class="elevation-1"
						>
							<template slot="items" slot-scope="props">
							<td
								v-for="header in Object.keys(props.item)"
								:key="header"
							>
								{{ props.item[header] }}
							</td>
							</template>
						</v-data-table>
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
import { colors } from "vuetify/lib";

@Component({
	components: {
	},
})

export default class Search extends Vue {

	private static resolveHeaders(data: any[]) {
		let dataHeaders: string[] = [];
		for (const record of data) {
			const headers = Object.keys(record);
			if (headers.length > dataHeaders.length) {
				dataHeaders = headers;
			}
		}
		return dataHeaders;
	}

	private schema: any[] = [
		{
			name: "bars",
			children: [
				{ name: "name: varchar(45)" },
				{ name: "license: varchar(100)" },
				{ name: "city: varchar(45)" },
				{ name: "state: varchar(45)" },
				{ name: "addr: varchar(100)" },
				{ name: "phone: varchar(20)" },
			],
		},
		{
			name: "billContains",
			children: [
				{ name: "trans_id: varchar(20)" },
				{ name: "item: varchar(45)" },
			],
		},
		{
			name: "drinkers",
			children: [
				{ name: "name: varchar(45)" },
				{ name: "city: varchar(45)" },
				{ name: "state: varchar(45)" },
				{ name: "addr: varchar(100)" },
				{ name: "phone: varchar(20)" },
			],
		},
		{
			name: "frequents",
			children: [
				{ name: "drinker: varchar(45)" },
				{ name: "bar: varchar(45)" },
			],
		},
		{
			name: "hours",
			children: [
				{ name: "bar: varchar(45)" },
				{ name: "opens: time" },
				{ name: "closes: time" },
				{ name: "day: tinyint(4)" },
			],
		},
		{
			name: "items",
			children: [
				{ name: "item_name: varchar(45)" },
				{ name: "manufacturer: varchar(45)" },
				{ name: "item_type: varchar(10)" },
			],
		},
		{
			name: "likes",
			children: [
				{ name: "drinker: varchar(45)" },
				{ name: "item: varchar(45)" },
			],
		},
		{
			name: "sells",
			children: [
				{ name: "bar: varchar(45)" },
				{ name: "item: varchar(45)" },
				{ name: "price: decimal(13,2)" },
			],
		},
		{
			name: "transaction",
			children: [
				{ name: "trans_id: varchar(20)" },
				{ name: "date: datetime" },
				{ name: "day: tinyint(4)" },
				{ name: "time: time" },
				{ name: "bar: varchar(45)" },
				{ name: "drinker: varchar(45)" },
				{ name: "tip: decimal(13,2)" },
				{ name: "total: decimal(13,2)" },
			],
		},
	];

	private query: string = "";
	private dbMessage: string = "";
	private allowQuery: boolean = true;

	private dataHeaders: any[] = [
	];
	private dataRows: any[] = [];

	private async valueCallback() {
		if (!this.query || this.query.trim().length < 1) {
			return;
		}
		this.allowQuery = false;

		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		fullURL += encodeURIComponent(`${this.query}`);
		try {
			const response = await axios.get(fullURL);
			const data = response.data as any[];
			const headers = Search.resolveHeaders(data);
			this.dataHeaders = [];
			for (const header of headers) {
				this.dataHeaders.push({ text: header, value: header });
			}
			this.dataRows = data; // set data
			this.dbMessage = `${data.length} row(s) returned`; // set message
		} catch (err) {
			if (err.response) {
				const data = err.response.data;
				const message = `Error Code: ${data.errno}${data.code ? "(" + data.code + ")" : ""}. ${data.sqlMessage}`;
				this.dbMessage = message; // set error message
				this.dataRows = []; // clear data
				console.error(message);
			} else {
				// network error
				this.dbMessage = err.message;
				this.dataRows = []; // clear data
				console.error(err);
			}
		} finally {
			this.allowQuery = true;
		}
	}

	private clearQueryInput() {
		this.query = "";
	}

	private showER() {
		const baseURL = process.env.BASE_URL;
		window.open(`${baseURL}/er_diagram.pdf`);
	}

	private exportCSV() {
		const data = this.dataRows;
		const headers = Search.resolveHeaders(data);
		const replacer = (key: any, value: any) => (value === null || value === undefined ? "" : value);
		const csv = data.map((row) => {
			return headers.map((header) => {
				return JSON.stringify(row[header], replacer);
			}).join(",");
		});
		csv.unshift(headers.join(","));
		const dataStr = `data:text/csv;charset=utf-8,${encodeURIComponent(csv.join("\n"))}`;
		this.downloadData(dataStr, "results.csv");
	}

	private exportJSON() {
		const data = this.dataRows;
		const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
		this.downloadData(dataStr, "results.json");
	}

	private downloadData(dataStr: string, filename: string) {
		const anchor = document.createElement("a");
		anchor.setAttribute("href", dataStr);
		anchor.setAttribute("download", filename);
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	}
}
</script>
