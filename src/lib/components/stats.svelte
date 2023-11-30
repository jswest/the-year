<script>
	import { possibilities } from '$lib/consts.js';
	export let storehouse;
	export let grid;
</script>

<div class="Stats">
	<div class="people">
		<p><b>people</b></p>
		<p>unemployed: {storehouse.people.filter((d) => !d.job).length}</p>
		{#each possibilities.jobs.filter((d) => d !== 'unemployed') as job}
			<p>{job}: {storehouse.people.filter((d) => d.job === job).length}</p>
		{/each}
	</div>
	<div class="buildings">
		<p><b>buildings</b></p>
		<p>houses: {grid.reduce((a, c) => a += c.building?.type === 'house' ? c.building.level : 0, 0)}</p>
		{#each possibilities.buildings.filter((d) => d !== 'house') as building}
			<p>{building}: {grid.reduce((a, c) => a += c.building?.type === building ? c.building.level : 0, 0)}</p>
		{/each}
	</div>
	<div class="resources">
		<p><b>resources</b></p>
		 <p>people: {Math.round(storehouse.people.length)}</p>
		 <p>foods: {Math.round(storehouse.foods)}</p>
		 <p>energy: {Math.round(storehouse.energy)}</p>
		 <p>goods: {Math.round(storehouse.goods)}</p>
		 <p>civics: {Math.round(storehouse.civics)}</p>
	</div>
</div>

<style>
	.Stats {
		height: 200px;
		width: calc((var(--unit) * 3) + (200px * 3));
	}
	.Stats div {
		background-color: white;
		box-sizing: border-box;
		float: left;
		height: 200px;
		margin-left: var(--unit);
		padding: var(--unit);
		width: calc(200px);
	}
</style>