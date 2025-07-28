const fs = require("node:fs");
const csv = require("csv-parser");

const results = [];

fs.createReadStream("data/data.csv")
	.pipe(csv())
	.on("data", (data) => results.push(data))
	.on("end", () => {
		// console.log(results);
		// fs.writeFile("data/data.json", results)
	});

// const [rl] = Buffer.from("\rl");
// const [nl] = Buffer.from("\nl");


// console.log(rl, nl)