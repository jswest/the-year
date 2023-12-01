<script>
	import { possibilities } from '$lib/consts.js';
	import { format } from '$lib/util.js';
	export let history;
	export let storehouse;
	export let grid;

	const historical = (attr) => {
		if (history[attr].length > 0) {
			if (attr === 'people') {
				return format(history.people.slice(-1)[0].length)
			} else {
				return format(history[attr].slice(-1)[0]);
			}
		} else {
			return 0;
		}
	}
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
		<p>people: {format(storehouse.people.length)} ({historical('people')})</p>
		<p>foods: {format(storehouse.foods)} ({historical('foods')})</p>
		<p>energy: {format(storehouse.energy)} ({historical('energy')})</p>
		<p>goods: {format(storehouse.goods)} ({historical('goods')})</p>
		<p>civics: {format(storehouse.civics)} ({historical('civics')})</p>
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