export const height = 10;
export const width = 10;

export const display = {
	farm: "#ddffee",
	factory: "#ffdddd",
	generator: "#ffffdd",
	house: "#ffddff",
	studio: "#ddeeff",
	farmer: "#ddffee",
	worker: "#ffdddd",
	engineer: "#ffffdd",
	artist: "#ddeeff",
	square: "white",
	unit: 20,
};

export const jobToBuilding = {
	farm: "farmer",
	engineer: "generator",
	worker: "factory",
	artist: "studio",
};

export const possibilities = {
	buildings: ["house", "farm", "generator", "factory", "studio"],
	jobs: ["unemployed", "farmer", "engineer", "worker", "artist"],
};

export const values = {
	decay: 0.25,
	improvement: 0.05,
};

export const starting = {
	foods: 0,
	energy: 10,
	goods: 0,
	civics: 0,
	people: 10,
};
