import readline from 'readline';
import fs from 'fs';

function read (file, cb) {
  const reader = fs.createReadStream(file);
  const lineReader = readline.createInterface({
    input: reader,
    terminal: true,
  });

  lineReader.on('line', line => {
    cb(line);
  });

  lineReader.on('close', () => {
    console.log('readline close...');
  });
}

export default read;
