const fs = require("node:fs");
const { Transform } = require("node:stream");

const csvFilePath = "starter.csv";

const readableStream = fs.createReadStream(csvFilePath, "utf-8");

// Using regex to parse line
function splitCSVLine(line) {
    return line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map((field) => field.replace(/^"|"$/g, ""));
}

const csvToJsonTransform = new Transform({
    transform(chunk, encoding, callback) {
        let lines = chunk.toString().split(/\r?\n/).filter(Boolean);
        if (!lines) return callback();

        lines = lines.map(splitCSVLine);

        const keys = lines[0].map((key) => key.toLowerCase());
        const rows = lines.slice(1);

        const entries = rows.map((row) => Object.fromEntries(row.map((value, i) => [keys[i], value])));

        this.push(JSON.stringify(entries, null, 2));
        callback();
    },
});

const writeableStream = fs.createWriteStream("output.ndjson");

readableStream
    .pipe(csvToJsonTransform)
    .pipe(writeableStream)
    .on("finish", () => {
        console.log("Conversion complete!");
    });
