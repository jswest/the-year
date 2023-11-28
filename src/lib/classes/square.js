import { color } from 'd3-color';
import { display } from "./../consts.js";

const { unit } = display;

export default class Square {
	#buildable = true;
	#building = null;
	#x = null;
	#y = null;

	constructor({ x, y }) {
		this.#x = x;
		this.#y = y;
	}

	construct(building) {
		this.#building = building;
	}

	destroy() {
		this.#building = null;
		this.#buildable = false;
	}

	get building() {
		return this.#building ;
	}

	get buildable() {
		return this.#buildable;
	}

	get fill() {
		if (this.#buildable) {
			if (this.#building && this.#building.level === 1) {
				return display[this.#building.type];
			} else if (this.#building && this.#building.level === 2) {
				return color(display[this.#building.type]).darker(0.5);
			} else if (this.#building && this.#building.level === 3) {
				return color(display[this.#building.type]).darker(1);
			}
			return display.square;
		} else {
			return 'transparent';
		}
	}

	get position() {
		return [this.#x, this.#y];
	}

	get transform() {
		return `${this.#x * unit},${this.#y * unit}`;
	}
}
