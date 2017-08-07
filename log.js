import fs from 'fs';

export default function log (data) {
  let text = '\n';
  for (let v of data) {
    text += `${v}\t`;
  }
  fs.appendFile('result/error.log', text, err => {
    if (err) {
      console.log(err);
    }
  });
}
