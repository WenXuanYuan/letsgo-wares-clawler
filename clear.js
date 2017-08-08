import fs from 'fs';
import {
  ProductsInsertHead,
  ProductFrontendCategotyInsertHead,
  SkusInsertHead,
  ImagesInsertHead,
  PropertiesInsertHead,
  ValuesInsertHead,
  SkuValueInsertHead
} from './sql_creater.js';
import { exec } from 'child_process';

const clear = () => new Promise((resolve, reject) => {
  try {
    fs.writeFileSync('result/error.log', '');
    fs.writeFileSync('result/errors.txt', '');
    fs.writeFileSync('result/products.sql', ProductsInsertHead);
    fs.writeFileSync('result/product_frontend_category.sql', ProductFrontendCategotyInsertHead);
    fs.writeFileSync('result/skus.sql', SkusInsertHead);
    fs.writeFileSync('result/images.sql', ImagesInsertHead);
    fs.writeFileSync('result/properties.sql', PropertiesInsertHead);
    fs.writeFileSync('result/values.sql', ValuesInsertHead);
    fs.writeFileSync('result/sku_value.sql', SkuValueInsertHead);
    fs.writeFileSync('result/test.sql', '');
    exec('rm -rf result/images/*', err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  } catch (err) {
    reject(err);
  }
});

// clear()
//   .catch(err => {
//     console.log(err);
//   });

export default clear;
