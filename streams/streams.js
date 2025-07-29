const fs = require("node:fs");

const readableStream = fs.createReadStream("data/file-1.txt", {
	// highWaterMark: 1024, // Buffer size
	encoding: "utf-8",
});

const writeableStream = fs.createWriteStream("output.txt");

readableStream.on("data", (chunk) => {
	console.log("Received chunk: ", chunk);
	writeableStream.write(chunk);
});

readableStream.on("end", () => {
	console.log("Finished reading file");
	writeableStream.end();
});

readableStream.on("error", (err) => {
	console.log("Error while reading:", err);
});
