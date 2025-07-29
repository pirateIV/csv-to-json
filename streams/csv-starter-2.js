const fs = require("node:fs");

const readableStream = fs.createReadStream("data.csv", "utf-8");
const writeableStream = fs.createWriteStream("output.ndjson");

fs.createWriteStream(readableStream)
	.pipe(writeableStream)
	.on("finish", () => {
		console.log("Read/Write Completed");
	});
