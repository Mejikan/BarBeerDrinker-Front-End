export interface TableHeader {
	name: string;
	datatype: string;
}

export class Table {
	public name: string;
	public headers: TableHeader[];

	constructor(name = "", headers: TableHeader[]) {
		this.name = name;
		this.headers = headers;
	}
}

export const BarTable = new Table("bars", [
	{ name: "name", datatype: "varchar(45)" },
	{ name: "license", datatype: "varchar(100)" },
	{ name: "city", datatype: "varchar(45)" },
	{ name: "state", datatype: "varchar(45)" },
	{ name: "addr", datatype: "varchar(100)" },
	{ name: "phone", datatype: "varchar(20)" },
]);

export const BillContainsTable = new Table("billContains", [
	{ name: "trans_id", datatype: "varchar(20)" },
	{ name: "item", datatype: "varchar(45)" },
]);

export const DrinkersTable = new Table("drinkers", [
	{ name: "name", datatype: "varchar(45)" },
	{ name: "city", datatype: "varchar(45)" },
	{ name: "state", datatype: "varchar(45)" },
	{ name: "addr", datatype: "varchar(100)" },
	{ name: "phone", datatype: "varchar(20)" },
]);

export const FrequentsTable = new Table("frequents", [
	{ name: "drinker", datatype: "varchar(45)" },
	{ name: "bar", datatype: "varchar(45)" },
]);

export const HoursTable = new Table("hours", [
	{ name: "bar", datatype: "varchar(45)" },
	{ name: "opens", datatype: "time" },
	{ name: "closes", datatype: "time" },
	{ name: "day", datatype: "tinyint(4)" },
]);

export const ItemsTable = new Table("items", [
	{ name: "item_name", datatype: "varchar(45)" },
	{ name: "manufacturer", datatype: "varchar(45)" },
	{ name: "item_type", datatype: "varchar(10)" },
]);

export const LikesTable = new Table("likes", [
	{ name: "drinker", datatype: "varchar(45)" },
	{ name: "item", datatype: "varchar(45)" },
]);

export const SellsTable = new Table("sells", [
	{ name: "bar", datatype: "varchar(45)" },
	{ name: "item", datatype: "varchar(45)" },
	{ name: "price", datatype: "decimal(13,2)" },
]);

export const TransactionsTable = new Table("transactions", [
	{ name: "trans_id", datatype: "varchar(20)" },
	{ name: "date", datatype: "datetime" },
	{ name: "day", datatype: "tinyint(4)" },
	{ name: "bar", datatype: "varchar(45)" },
	{ name: "drinker", datatype: "varchar(45)" },
	{ name: "tip", datatype: "decimal(13,2)" },
	{ name: "total", datatype: "decimal(13,2)" },
]);

export const TestTable = new Table("test", [
	{ name: "id", datatype: "int(11)" },
	{ name: "drinker", datatype: "varchar(45)" },
	{ name: "bar", datatype: "varchar(45)" },
	{ name: "phone", datatype: "varchar(45)" },
]);
