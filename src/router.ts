import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Drinker from "@/views/Drinker.vue";
import Bar from "@/views/Bar.vue";
import Beer from "@/views/Beer.vue";
import Interface from "@/views/Interface.vue";

Vue.use(Router);

export default new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "home",
			component: Home,
		},
		{
			path: "/bar",
			name: "bar",
			component: Bar,
		},
		{
			path: "/drinker/:name",
			component: Drinker,
		},
		{
			path: "/drinker",
			component: Drinker,
		},
		{
			path: "/beer",
			component: Beer,
		},
		{
			path: "/interface",
			component: Interface,
		},
	],
});
