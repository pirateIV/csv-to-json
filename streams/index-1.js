const fs = require("fs");

// Create a readable stream
const readableStream = fs.createReadStream("data/file-1.txt", {
	encoding: "utf-8",
});

// Listen for data chunks
readableStream.on("data", (chunk) => {
	console.log(`Received ${chunk.length} bytes of data.`);
});

// Listen for the end
readableStream.on("end", () => {
	console.log("No more data.");
});

// Handle errors
readableStream.on("error", (err) => {
	console.error("Error:", err);
});

fs.createReadStream("data/file-1.txt").pipe(fs.createWriteStream("data/output.txt"));
