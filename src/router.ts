import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Search from "@/views/Search.vue";
import Drinker from "@/views/Drinker.vue";
import Bar from "@/views/Bar.vue";

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
			path: "/search",
			name: "search",
			component: Search,
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
	],
});
