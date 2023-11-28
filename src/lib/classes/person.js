import { possibilities, values } from "./../consts.js";
import { names } from "./../data/names.js";
const { jobs } = possibilities;
const { improvement } = values;

export default class Person {
	#name = null;
	#job = null;
	#skill = {};

	constructor() {
		this.#name = names[Math.floor(Math.random() * (names.length - 1))].toLowerCase();
		for (const job of jobs.filter((d) => d !== 'unemployed')) {
			this.#skill[job] = 1 + Math.random();
		}
	}

	employ(job) {
		this.#job = job;
	}

	get name() {
		return this.#name;
	}

	get job() {
		return this.#job;
	}

	set job(job) {
		this.#job = job;
	}

	get skill() {
		return this.#skill;
	}

	set name(name) {
		this.#name = name;
	}

	improve() {
		this.#skill[this.#job] += improvement;
		if (this.#skill[this.#job] > 3) {
			return this.#skill[this.#job] = 3;
		}
	}

	harvest() {
		const amount = this.#skill[this.#job];
		this.improve(this.#job);
		return amount;
	}

}
