<template>
	<div class="search">
		<v-container fluid grid-list-xs>
			<v-layout row wrap>
				<v-flex xs12 lg4 class="px-2 pb-2">
					<v-card>
						<v-dialog v-model="showER">
							<v-card>
								<v-card-title>
									<span class="headline">ER DIAGRAM</span>
									<v-spacer></v-spacer>
									<v-btn @click="showER = !showER">
										<v-icon>close</v-icon>
										Close
									</v-btn>
								</v-card-title>
								<v-card-text>
									<v-img
										contain
										:src="require('@/assets/er_diagram.png')"
										max-width="76vw"
										max-height="76vh"
									></v-img>
								</v-card-text>
							</v-card>
						</v-dialog>
						<v-card-title class="title">
							BarBeerDrinker Tables
							<v-spacer></v-spacer>
							<v-tooltip top>
								<v-btn
									fab
									small
									slot="activator"
									class="info ma-0"
									@click="showER = !showER"
								>
									<v-icon>launch</v-icon>
								</v-btn>
								<span>Open ER Diagram</span>
							</v-tooltip>
						</v-card-title>
						<v-card-text>
							<p>
								This is the schema for our database. The table names are listed below.
								Expanding each table name will show the headers of those tables and their
								respective types. The name of the databse is "BarBeerDrinker".
							</p>
							<v-treeview
								:items="schema"
								transition
								open-on-click
							></v-treeview>
						</v-card-text>
					</v-card>
				</v-flex>
				<v-flex xs12 lg8>
					<v-expansion-panel>
						<v-expansion-panel-content>
							<v-subheader slot="header">
								Verification Queries
								<v-tooltip top>
									<v-icon slot="activator" class="ml-2" color="info">information</v-icon>
									<span>
										(Expand to show more) Selecting a verification query will insert the query below.
										Each response should return 0 rows.
									</span>
								</v-tooltip>
							</v-subheader>
							<div class="text-xs-center">
								<v-btn outline @click="verifyQuery1">one</v-btn>
								<v-btn outline @click="verifyQuery2">two</v-btn>
								<v-btn outline @click="verifyQuery3">three</v-btn>
							</div>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-card>
						<v-card-text>
							<v-subheader>
								Query Input
								<v-tooltip top>
									<v-icon slot="activator" class="ml-2" color="info">information</v-icon>
									<span>Input any valid SQL query in the box below. Then press the EXECUTE button.</span>
								</v-tooltip>
							</v-subheader>
							<v-textarea 
								v-model="query"
								auto-grow
								autofocus
								outline
								append-icon="clear"
								@click:append="clearQueryInput"
							></v-textarea>

							<v-subheader>
								Query Response
								<v-tooltip top>
									<v-icon slot="activator" class="ml-2" color="info">information</v-icon>
									<span>(Readonly) The response returned from the database for a given query.</span>
								</v-tooltip>
							</v-subheader>
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
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
				<v-flex xs12>
					<v-divider class="my-4" v-show="dataRows.length > 0"></v-divider>
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

import { Table, BarTable, BillContainsTable, DrinkersTable, FrequentsTable,
	HoursTable, ItemsTable, LikesTable, SellsTable, TransactionsTable } from "@/util/tables";

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

	private get schema(): any[] {
		const results: any[] = [];
		const allTables: Table[] = [
			// TestTable,
			BarTable,
			BillContainsTable,
			DrinkersTable,
			FrequentsTable,
			HoursTable,
			ItemsTable,
			LikesTable,
			SellsTable,
			TransactionsTable,
		];

		for (const table of allTables) {
			const children: any[] = [];
			for (const header of table.headers) {
				children.push( { name : `${header.name}: ${header.datatype}` }) ;
			}
			const tableSchema = {
				name: table.name,
				children,
			};
			results.push(tableSchema);
		}
		return results;
	}

	private query: string = "";
	private dbMessage: string = "";
	private allowQuery: boolean = true;

	private dataHeaders: any[] = [
	];
	private dataRows: any[] = [];

	private showER: boolean = false;

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

	private async verifyQuery1() {
		// Detecting transactions after hours
		this.query = `SELECT * FROM BarBeerDrinker.transactions t,
			(SELECT h.*, IF(hour(h.closes) < hour(h.opens), 1, 0) AS flag
			FROM BarBeerDrinker.hours h) h
			WHERE (
            ( h.flag = 0 && (( hour(time(t.date)) >= hour(h.closes) || hour(time(t.date)) < hour(h.opens) )
				&& h.bar = t.bar && (h.day-1) = dayofweek(t.date)) ) OR
			( h.flag = 1 && (( hour(time(t.date)) >= hour(h.closes) && hour(time(t.date)) < hour(h.opens) )
				&& h.bar = t.bar && (h.day-1) = dayofweek(t.date)) ) );`;
		// this.query = `SELECT *
		// 		from BarBeerDrinker.transactions t, BarBeerDrinker.hours h
		// 		where hour(time(t.date)) <= h.closes
		// 			&& hour(time(t.date)) >= h.opens
		// 			&& h.bar = t.bar`;
	}

	private async verifyQuery2() {
		// Detecting drinkers frequenting out of state
		this.query = `SELECT *
			FROM BarBeerDrinker.frequents f, BarBeerDrinker.bars b, BarBeerDrinker.drinkers d
			WHERE d.name = f.drinker && b.name = f.bar && b.state <> d.state;`;
	}

	private async verifyQuery3() {
		// Detecting transactions after hours
		this.query = `SELECT *
			FROM BarBeerDrinker.sells s1, BarBeerDrinker.sells s2, BarBeerDrinker.sells s3, BarBeerDrinker.sells s4
			WHERE s1.bar <> s2.bar && s1.bar = s3.bar && s2.bar = s4.bar
				&& s1.item = s3.item && s2.item = s4.item
				&& s1.price > s2.price && s3.price < s4.price limit 1`;
	}
}
</script>
