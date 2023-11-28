export default class Building {	
	#employees = [];
	#level = 1;
	#type = null;

	constructor({type}) {
		this.#type = type;
	}

	get type() {
		return this.#type;
	}

	get level() {
		return this.#level;
	}

	downgrade() {
		this.#level--;
		return this.#level;
	}

	upgrade() {
		this.#level++;
		return this.#level;
	}
}