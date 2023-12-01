<script>
	import { display, height, jobToBuilding, possibilities, starting, values, width } from '$lib/consts.js';
	import { history, storehouse } from '$lib/stores.js';
	import Building from '$lib/classes/building.js';
	import Person from '$lib/classes/person.js';
	import Square from '$lib/classes/square.js';
	import Stats from '$lib/components/stats.svelte';

	const { unit } = display;
	const { buildings, jobs } = possibilities;
	const { decay } = values;

	let selected = null;
	let state = 'intro';

	for (let i = 0; i < starting.people; i++) {
		storehouse.people = [...storehouse.people, new Person()]
	}

	let grid = [];
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			grid.push(new Square({x, y}))
		}
	}

	const build = ({selected, type}) => {
		const square = grid.find((d) => selected === d.transform);
		if (square.buildable && storehouse.energy > 0) {
			storehouse.energy -= 1 * Math.max(1, storehouse.weeks * decay);
			square.construct(new Building({type}))
			grid = [...grid]
		}
	}

	const upgrade = ({ selected }) => {
		const square = grid.find((d) => selected === d.transform);
		storehouse.energy -= 2 * Math.max(1, storehouse.weeks * decay);
		square.building.upgrade();
		grid = [...grid]
	}

	const harvest = () => {
		const counts = {}
		
		for (const job of jobs) {
			counts[job] = 0;
		}
		for (const person of storehouse.people) {
			counts[person.job]++;
		}
		
		for (const building of buildings) {
			counts[building] = 0;
		}
		for (const square of grid) {
			if (square.building) {
				counts[square.building.type] += square.building.level;
			}
		}

		history.foods = [...history.foods, storehouse.foods];
		const food = Math.min(counts.farm, counts.farmer);
		storehouse.foods += food * storehouse.people.reduce((a, c) => a += c.job === 'farmer' ? c.harvest() : 0, 0);
		storehouse.foods -= storehouse.people.length * Math.max(1, storehouse.weeks * decay);
		if (storehouse.foods < 0) {
			state = 'lost';
			return;
		}

		history.energy = [...history.energy, storehouse.energy];
		const energy = Math.min(counts.engineer, counts.generator);
		storehouse.energy -= grid.reduce((a, c) => a += c.building?.level ? c.building?.level * 2 : 0, 0)
		storehouse.energy += energy * storehouse.people.reduce((a, c) => a += c.job === 'engineer' ? c.harvest() : 0, 0);
		if (storehouse.energy < 0) {
			state = 'lost';
			return;
		}

		history.goods = [...history.goods, storehouse.goods];
		const goods = Math.min(counts.worker, counts.factory);
		storehouse.goods += goods * storehouse.people.reduce((a, c) => a += c.job === 'worker' ? c.harvest() : 0, 0);

		history.civics = [...history.civics, storehouse.civics];
		let civics = Math.min(counts.artist, counts.studio);
		storehouse.goods -= civics * Math.max(1, storehouse.weeks * decay);
		storehouse.civics -= storehouse.people.map((d) => d.job ? d.skill[d.job] : 1).reduce((a, c) => a += c / 2, 0);
		storehouse.civics += civics * storehouse.people.reduce(
			(a, c) => a += c.job === 'artist' ? c.harvest() : 0, 0
		);
		if (storehouse.civics < -50) {
			state = 'lost';
			return;
		} else if (storehouse.civics < -40) {
			storehouse.people = [...storehouse.people.slice(3)];
		} else if (storehouse.civics < -30) {
			storehouse.people = [...storehouse.people.slice(2)];;
		} else if (storehouse.civics < -20) {
			storehouse.people = [...storehouse.people.slice(1)];;
		}

		if (counts.house < storehouse.people.length) {
			storehouse.civics -= (storehouse.people.length - counts.house) * Math.max(1, storehouse.weeks * decay);
		}

		const buildables = grid.filter((d) => d.buildable);
		buildables[Math.floor(Math.random() * (buildables.length - 1))].destroy();

		history.people = [...history.people, storehouse.people];
		for (let i = 0; i < Math.ceil(Math.random() * 2); i++) {
			storehouse.people.push(new Person());
		}
		grid = [...grid];
		storehouse.weeks++;

		if (storehouse.weeks > 52) {
			state = 'won';
		}
	}


</script>

<div class="page">
	{#if state === 'intro'}
		<div class="intro-text" on:click={() => state = 'game'}>
			<p>first the coastal cities were beaten down by waves, roads became canals, skyscrapers fell. then the brackish water wound its way up the rivers, seeped into the groundwater, turning green fields barren brown. then the fires turned the forests to dust, turned the prairies to dust. turned the land to black. then refugees came in waves, crashing against walls and borders. war came next, then famine and disease.</p>
			<p>civilization collapsed.</p>
			<p>you and yours and the refugees who will come: you're all that's left.</p>
			<p>this is <b>the year</b>.</p>
		</div>
	{/if}
	{#if state === 'game'}
		<div class="game">
			<header>
				<h1>the year. week {storehouse.weeks}.</h1>
			</header>
			<div class="controls">
				<h2 on:click={harvest}>harvest.</h2>
			</div>
			<div class="grid">
				<div class="build-menu">
					{#if selected}
						<h2>build.</h2>
						{#each buildings as building}
							<p
								class="clickable"
								on:click={() => {build({selected, type: building})}}
							>{building}</p>
						{/each}
						{#if grid.find((d) => selected === d.transform)?.building?.level < 3}
							<h2
								on:click={() => upgrade({selected})}
							>upgrade.</h2>
						{/if}
					{/if}
				</div>
				<svg height={height * unit} width={width * unit}>
					{#each grid as square}
						<g transform="translate({square.transform})">
							<rect
								fill={square.fill}
								height={unit - 2}
								stroke={selected === square.transform ? 'black' : 'transparent'}
								stroke-width=1
								width={unit - 2}
								x=1
								y=1
								on:click={() => selected = selected === square.transform ? null : square.transform}
							/>
						</g>
					{/each}
				</svg>
				<div class="stats">
					<Stats grid={grid} history={history} storehouse={storehouse} />
				</div>
			</div>
			<div class="people">
				<table>
					<thead>
						<tr>
							<th>name</th>
							<th>job</th>
							<th>artistry</th>
							<th>engineering</th>
							<th>farming</th>
							<th>working</th>
						</tr>
					</thead>
				</table>
				<div class="people-guts">
					<table>
						<tbody>
							{#each storehouse.people.sort((a, b) => a.name > b.name) as person}
								<tr style="background-color: {display[person.job]}">
									<td>{person.name}</td>
									<td>{person.job}</td>
									<td on:click={() => person.job = 'artist'}>{Math.round(person.skill.artist * 100) / 100}</td>
									<td on:click={() => person.job = 'engineer'}>{Math.round(person.skill.engineer * 100) / 100}</td>
									<td on:click={() => person.job = 'farmer'}>{Math.round(person.skill.farmer * 100) / 100}</td>
									<td on:click={() => person.job = 'worker'}>{Math.round(person.skill.worker * 100) / 100}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
	{#if state === 'lost'}
		<div class="intro-text">
			<p>you lost.</p>
		</div>
	{/if}
	{#if state === 'won'}
		<div class="intro-text">
			<p>you won with {storehouse.civis} civics.</p>
		</div>
	{/if}
</div>

<style>
.page {
	min-height: 100vh;
	width: 100vw;
}
.intro-text {
	background-color: black;
	box-sizing: border-box;
	color: white;
	height: 100vh;
	padding: var(--unit);
	width: 100vw;
}
.intro-text p {
	margin-bottom: var(--unit);
	width: 600px;
}

.game {
	background-color: black;
	min-height: 100vh;
	width: 100vw;
}

.controls {
	background-color: white;
	box-sizing: border-box;
	margin-left: var(--unit);
	margin-right: var(--unit);
	padding: var(--unit);
	width: calc((200px * 5) + (var(--unit) * 4));
}

header {
	color: white;
	padding: var(--unit);
}

.grid {
	height: 200px;
	margin-top: var(--unit);
	width: 100%;
}
.grid .build-menu {
	background-color: white;
	box-sizing: border-box;
	float: left;
	height: 200px;
	margin-left: var(--unit);
	padding: var(--unit);
	width: 200px;
}
.grid .build-menu h2 {
	margin-top: var(--unit);
}
.grid .build-menu h2:first-child {
	margin-top: 0;
}
.grid .build-menu p.clickable {
	cursor: pointer;
	text-decoration: underline;
}
.grid svg {
	display: block;
	float: left;
	margin-left: var(--unit);
}
.grid svg rect{
	cursor: pointer;
}

.stats {
	float: left;
}

.people {
	margin-bottom: var(--unit);
	margin-left: var(--unit);
	margin-top: var(--unit);
	width: calc((200px * 5) + (var(--unit) * 4));
}
.people table {
	background-color: white;
	border-collapse: collapse;
	table-layout: fixed;
	width: 100%;
}
.people .people-guts {
	display: block;
	height: 400px;
	overflow-y: scroll;
	position: relative;
}
.people table td,
.people table th {
	border: 1px solid #dedede;
	padding: calc(var(--unit) * 0.25);
}
</style>
