import axios from 'axios';
import iconv from 'iconv-lite';
import fs from 'fs';

export const fetchList = name => new Promise((resolve, reject) => {
  let uri = `http://search.jd.com/Search?keyword=${name}&enc=utf-8`;
  uri = encodeURI(uri);
  axios.get(uri)
    .then(res => {
      // console.log(res.data);
      resolve(res.data);
    })
    .catch(err => {
      reject(err);
    });
});

// fetchList('hh')
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err.message);
//   });
// data_sku

export const fetchWare = skuId => new Promise((resolve, reject) => {
  axios.get(`http://item.jd.com/${skuId}.html`, {
    responseType: 'arraybuffer',
  })
    .then(res => {
      let text = Buffer.from(res.data, 'binary');
      let strGbk = iconv.decode(text, 'gbk');
      let bufUtf8 = iconv.encode(strGbk, 'utf8');
      let strUtf8 = iconv.decode(bufUtf8, 'utf8');
      resolve(strUtf8);
    })
    .catch(err => {
      reject(err);
    });
});

// fetchWare(711778)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err.message);
//   });
// // class: p-parameter
// // class: spec-items  n5->n1

export const writeImage = address => new Promise(async (resolve, reject) => {
  // console.log(address);

  try {
    let res = await axios.get(address, {
      responseType: 'stream',
    });
    let rootDir = 'result/images'
    let date = (new Date()).toLocaleString();
    let reg = /(\d+)\/(\d+)\/(\d+), (.*)/;
    let dir = date.replace(reg, (str, $1, $2, $3) => `${$3}-${$2.padStart(2, 0)}-${$1.padStart(2, 0)}`);
    let name = `${Date.now()}${Math.ceil(Math.random() * 1000)}.png`;
    // console.log(name);
    if (!fs.existsSync(`${rootDir}/${dir}`)) {
      fs.mkdirSync(`${rootDir}/${dir}`);
    }
    res.data.pipe(fs.createWriteStream(`${rootDir}/${dir}/${name}`));
    resolve(`${dir}/${name}`);
  } catch (err) {
    reject(err);
  }

  // axios.get(address, {
  //   responseType: 'stream',
  // })
  //   .then(res => {
  //     let rootDir = 'result/images'
  //     let date = (new Date()).toLocaleString();
  //     let reg = /(\d+)\/(\d+)\/(\d+), (.*)/;
  //     let dir = date.replace(reg, (str, $1, $2, $3) => `${$3}-${$2.padStart(2, 0)}-${$1.padStart(2, 0)}`);
  //     let name = `${Date.now()}${Math.ceil(Math.random() * 1000)}.png`;
  //     // console.log(name);
  //     if (!fs.existsSync(`${rootDir}/${dir}`)) {
  //       fs.mkdirSync(`${rootDir}/${dir}`);
  //     }
  //     res.data.pipe(fs.createWriteStream(`${rootDir}/${dir}/${name}`));
  //     resolve(`${dir}/${name}`);
  //   })
  //   .catch(err => {
  //     reject(err);
  //   });

});

// writeImage('http://img13.360buyimg.com/n1/jfs/t2764/110/2479467247/313803/400724dc/57677d39N40618593.jpg')
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err.message);
//   });

// let imgs = [
//   'http://img13.360buyimg.com/n1/jfs/t2809/125/2537953307/326273/1bbc8a9f/576a3b19Nc30012c0.jpg',
//   'http://img13.360buyimg.com/n1/jfs/t2932/279/759495863/243388/5086177e/57677d33Ned8dbfd5.jpg',
//   'http://img13.360buyimg.com/n1/jfs/t2764/110/2479467247/313803/400724dc/57677d39N40618593.jpg',
//   'http://img13.360buyimg.com/n1/jfs/t2797/63/2504182217/99235/7ee9f6e0/57677d3eN21d3601b.jpg',
//   'http://img13.360buyimg.com/n1/jfs/t2617/55/2485716740/217324/61066a54/57677d43Ne2559beb.jpg'
// ];
// imgs.forEach(async address => {
//   try {
//     let path = await writeImage(address);
//     console.log(path);
//   } catch (err) {
//     console.log(err);
//   }
// });
