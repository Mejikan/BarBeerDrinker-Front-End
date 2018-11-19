<template>
	<div class="modify">
		<v-dialog
			v-model="showDialog"
			width="50%"
		>
			<v-card>
				<v-card-title
					primary-title
					:class="successMod ? 'success' : 'error'"
					class="title white--text"
				>
					Response
				</v-card-title>
				<v-card-text>
					{{ dbMessage }}
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						class="primary"
						@click="showDialog = !showDialog"
					>
						Close
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
			<v-form>
				<v-layout row wrap>
					<v-flex xs12 md6 lg4 class="px-3">
						<v-select
							:items="operations"
							v-model="operation"
							label="Modification"
							box
							required
						></v-select>
					</v-flex>
					<v-flex xs12 md6 lg8 class="px-3">
						<v-select
							:items="tableNames"
							v-model="table"
							label="Table Name"
							box
							required
						></v-select>
					</v-flex>
				</v-layout>
				<v-divider class="my-3" v-show="showWhereInput"></v-divider>
				<v-subheader v-show="showWhereInput">
					FIND RECORDS WITH FIELD VALUES MATCHING
					<v-tooltip top>
						<v-icon slot="activator" class="ml-2" color="info">information</v-icon>
						<span>The selected operation will be performed on records that match the set of values below.</span>
					</v-tooltip>
				</v-subheader>
				<v-flex class="px-3" v-show="showWhereInput">
					<v-text-field
						v-for="(column, index) in columns"
						:key="`where-${column}`"
						v-model="whereData[index]"
						:label="column"
						outline
					></v-text-field>
				</v-flex>
				<v-divider class="my-3" v-show="showSetInput"></v-divider>
				<v-subheader v-show="showSetInput">
					SET FIELD VALUES TO
					<v-tooltip top>
						<v-icon slot="activator" class="ml-2" color="info">information</v-icon>
						<span>These are the set of new column values that will be applied to the row.</span>
					</v-tooltip>
				</v-subheader>
				<v-flex class="px-3" v-show="showSetInput">
					<v-text-field
						v-for="(column, index) in columns"
						:key="`set-${column}`"
						v-model="setData[index]"
						:label="column"
						outline
					></v-text-field>
				</v-flex>
				<v-divider class="my-3"></v-divider>
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
						@click="query"
					>
						COMMIT
					</v-btn>
				</v-card-actions>
			</v-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Env } from "@/env";
import axios from "axios";

import { Table, BarTable, BillContainsTable, DrinkersTable, FrequentsTable,
	HoursTable, ItemsTable, LikesTable, SellsTable, TransactionsTable } from "@/util/tables";

@Component({
	components: {
	},
})
export default class Modify extends Vue {
	private operations: string[] = [
		"INSERT",
		"UPDATE",
		"DELETE",
	];

	private tables: Table[] = [
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

	private operation = this.operations[0];
	private table_: Table = this.tables[0];
	private whereData: string[] = [];
	private setData: string[] = [];

	private allowQuery: boolean = true;

	private showDialog: boolean = false;
	private successMod: boolean = true;
	private dbMessage: string = "";

	private get showWhereInput(): boolean {
		return this.operation === "UPDATE" || this.operation === "DELETE";
	}

	private get showSetInput(): boolean {
		return this.operation === "UPDATE" || this.operation === "INSERT";
	}

	private get table(): string {
		return this.table_.name;
	}

	private set table(value: string) {
		this.table_ = this.getTable(value);
	}

	private get columns(): string[] {
		const names: string[] = [];
		for (const header of this.table_.headers) {
			names.push(`${header.name}: ${header.datatype}`);
		}
		return names;
	}

	private get tableNames(): string[] {
		const names: string[] = [];
		for (const table of this.tables) {
			names.push(table.name);
		}
		return names;
	}

	private getTable(tableName: string): Table {
		for (const table of this.tables) {
			if (table.name === tableName) {
				return table;
			}
		}
		throw new Error();
	}

	private isNotEmpty(value: any): boolean {
		const str = value as string;
		if (value && value.trim().length > 0) {
			return true;
		}
		return false;
	}

	private insertQuery(tableName: string, setKv: Map<string, string>): string {
		let keyStr = "";
		let valStr = "";
		for (const kvPair of setKv) {
			if (this.isNotEmpty(kvPair[1])) {
				keyStr += kvPair[0] + ",";
				valStr += "'" + kvPair[1] + "',";
			}
		}
		keyStr = keyStr.substring(0, keyStr.length - 1);
		valStr = valStr.substring(0, valStr.length - 1);

		return `INSERT INTO BarBeerDrinker.${tableName} (${keyStr}) VALUES (${valStr})`;
	}

	private updateQuery(tableName: string, setKv: Map<string, string>, whereKv: Map<string, string>): string {
		let setKvStr = "";
		for (const setKvPair of setKv) {
			if (this.isNotEmpty(setKvPair[1])) {
				setKvStr += setKvPair[0] + "='" + setKvPair[1] + "',";
			}
		}
		setKvStr = setKvStr.substring(0, setKvStr.length - 1);

		let whereKvStr = "";
		for (const whereKvPair of whereKv) {
			if (this.isNotEmpty(whereKvPair[1])) {
				whereKvStr += whereKvPair[0] + "='" + whereKvPair[1] + "' AND ";
			}
		}
		whereKvStr = whereKvStr.substring(0, whereKvStr.length - 5);

		return `UPDATE BarBeerDrinker.${tableName} SET ${setKvStr} WHERE ${whereKvStr}`;
	}

	private deleteQuery(tableName: string, whereKv: Map<string, string>): string {
		let whereKvStr = "";
		for (const whereKvPair of whereKv) {
			if (this.isNotEmpty(whereKvPair[1])) {
				whereKvStr += whereKvPair[0] + "='" + whereKvPair[1] + "' AND ";
			}
		}
		whereKvStr = whereKvStr.substring(0, whereKvStr.length - 5);

		return `DELETE FROM BarBeerDrinker.${tableName} WHERE ${whereKvStr}`;
	}

	private async query() {
		this.allowQuery = false;

		const setKv = new Map<string, string>();
		for (let n = 0; n < this.table_.headers.length; n++) {
			const header = this.table_.headers[n];
			setKv.set(header.name, this.setData[n]);
		}

		const whereKv = new Map<string, string>();
		for (let n = 0; n < this.table_.headers.length; n++) {
			const header = this.table_.headers[n];
			whereKv.set(header.name, this.whereData[n]);
		}

		let fullURL: string = `${Env.SITE_API_DOMAIN}/sql?q=`;
		if (this.operation === "INSERT") {
			const q = this.insertQuery(this.table, setKv);
			console.log(q);
			fullURL += encodeURIComponent(`${q}`);
		} else if (this.operation === "UPDATE") {
			const q = this.updateQuery(this.table, setKv, whereKv);
			console.log(q);
			fullURL += encodeURIComponent(`${q}`);
		} else if (this.operation === "DELETE") {
			const q = this.deleteQuery(this.table, whereKv);
			console.log(q);
			fullURL += encodeURIComponent(`${q}`);
		}
		try {
			const response = await axios.get(fullURL);
			const resData = response.data;
			let message = `[ Affected Rows: ${resData.affectedRows},
							Changed Rows: ${resData.changedRows},
							Field Count: ${resData.fieldCount},
							Insert Id: ${resData.insertId},
							Server Status: ${resData.serverStatus},
							Warning Count: ${resData.warningCount} ]`;
			if (resData.message && resData.message.trim().length > 0) {
				message += resData.message;
			}
			this.dbMessage = message;
			this.successMod = true;
		} catch (err) {
			if (err.response) {
				const data = err.response.data;
				const message = `Error Code: ${data.errno}${data.code ? "(" + data.code + ")" : ""}. ${data.sqlMessage}`;
				this.dbMessage = message; // set error message
				console.error(message);
			} else {
				// network error
				this.dbMessage = err.message;
				console.error(err);
			}
			this.successMod = false;
		} finally {
			this.showDialog = true;
			this.allowQuery = true;
		}
	}

	private async mounted() {
		if (this.$route.query.modify) {
			this.table = "transactions";
		}
	}
}
</script>
