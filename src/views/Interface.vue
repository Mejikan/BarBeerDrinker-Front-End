<template>
	<div class="interface">
		<v-container fluid>
			<v-tabs centered icons-and-text>
				<v-tab key="search">
					Search
					<v-icon>search</v-icon>
				</v-tab>
				<v-tab key="modify">
					Modify
					<v-icon>edit</v-icon>
				</v-tab>
				<v-tab-item key="search">
					<v-card>
						<v-card-title primary-title class="title">
							QUERY DATABASE
						</v-card-title>
						<Search/>
					</v-card>
				</v-tab-item>
				<v-tab-item key="modify">
					<v-card>
						<v-card-title primary-title class="title">
							MODIFY DATABASE
							<v-tooltip top>
								<v-icon slot="activator" class="ml-2" color="info">information</v-icon>
								<span>
									Select an operation to modify the database (INSERT, UPDATE, DELETE) and a table to
									perform the operation on. Press the COMMIT button below to perform the operation.
								</span>
							</v-tooltip>
						</v-card-title>
						<v-card-text>
							<Modify/>
						</v-card-text>
					</v-card>
				</v-tab-item>
			</v-tabs>
		</v-container>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Search from "@/components/Search.vue";
import Modify from "@/components/Modify.vue";

@Component({
	components: {
		Search,
		Modify,
	},
})
export default class Interface extends Vue {
}
</script>
