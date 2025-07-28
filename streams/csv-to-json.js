const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');

class CSVToJSONConverter extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    
    // Configuration
    this.delimiter = options.delimiter || ',';
    this.headers = options.headers || null;
    this.strictMode = options.strictMode !== false;
    this.quote = options.quote || '"';
    
    // State tracking
    this.decoder = new StringDecoder('utf8');
    this.buffer = '';
    this.isFirstChunk = true;
    this.lineNumber = 0;
  }

  _transform(chunk, encoding, callback) {
    this.buffer += this.decoder.write(chunk);
    this._processBuffer(callback);
  }

  _flush(callback) {
    this.buffer += this.decoder.end();
    if (this.buffer.trim()) {
      this._processBuffer(callback);
    } else {
      callback();
    }
  }

  _processBuffer(callback) {
    let lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop(); // Save incomplete line

    if (this.isFirstChunk && !this.headers) {
      this.headers = this._parseLine(lines.shift());
      this.isFirstChunk = false;
    }

    for (const line of lines) {
      this.lineNumber++;
      try {
        if (!line.trim()) continue;
        
        const values = this._parseLine(line);
        if (this.strictMode && values.length !== this.headers.length) {
          throw new Error(`Column count mismatch on line ${this.lineNumber}`);
        }
        
        const obj = {};
        this.headers.forEach((header, i) => {
          obj[header] = i < values.length ? values[i] : null;
        });
        
        this.push(obj);
      } catch (err) {
        this.emit('error', err);
        return;
      }
    }
    
    callback();
  }

  _parseLine(line) {
    // Simple quoted value parser (can be enhanced later)
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === this.quote) {
        if (inQuotes && line[i + 1] === this.quote) {
          // Escaped quote
          current += this.quote;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === this.delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(field => field.trim());
  }
}

module.exports = CSVToJSONConverter;