import { fetchList, fetchWare, writeImage } from './fetch.js';
import { getDataSku, getInfo, getCategories } from './filter.js';
import {
  ProductsInsertHead,
  ProductFrontendCategotyInsertHead,
  SkusInsertHead,
  ImagesInsertHead,
  PropertiesInsertHead,
  ValuesInsertHead,
  SkuValueInsertHead,
  createProductsSql,
  createProductFrontendCategorySql,
  createPropertiesSql,
  createSkusSql,
  createImagesSql,
  createValuesSql,
  createSkuValueSql
} from './sql_creater.js';
import {
  queryFrontendCategories,
  queryFrontendCategoryId,
  queryProperty,
  queryValue,
  transInsert
} from './sql_executer.js';
import fs from 'fs';
import log from './log.js';
import clear from './clear.js';
// const file = 'wares.txt';
const file = 'ware.txt';

let productId = 1;
let skuId = 1;
let productFrontendCategotyId = 1;
let propertyId = 1;
let imageId = 1;
let valueId = 1;
let skuValueId = 1;

let fileData = fs.readFileSync(file, { encoding: 'utf8' });
fileData = fileData.split(/\n/);
// console.log(fileData);
const run = async () => {
  await clear();
  for (let line of fileData) {
    if (!line) {
      continue;
    }
    let data = line.split(/\s+/);
    // data: barcode, name, guige, unit, price
    console.log(data);
    try {
      let sqlData = {};
      let listHtml = await fetchList(data[1]);
      // console.log(listHtml);
      let dataSku = getDataSku(listHtml);
      if (!dataSku) {
        throw new Error('wares not found');
      }
      // console.log(dataSku);

      let infoHtml = await fetchWare(dataSku);
      let info = getInfo(infoHtml);
      // console.log(info);

      /**
       * write product
       */
      let productCode = '0001' + String(productId).padStart(6, 0);
      let productsSqlData = await createProductsSql(productId, data[1], productCode, '规格: ' + data[2]);
      sqlData.products = `${ProductsInsertHead}\n${productsSqlData};`;

      /**
       * write frontend category id
       */
      let frontendCates = await queryFrontendCategories(info.cateWords);
      let cate = 173;
      if (frontendCates.length !== 0) {
        frontendCates = getCategories(frontendCates);
      // console.log(frontendCates);
        if (frontendCates.cate3) {
          cate = frontendCates.cate3;
        } else {
          cate = await queryFrontendCategoryId(frontendCates.cate2 || frontendCates.cate1);
        }
      }
      let productFrontendCategorySqlData = await createProductFrontendCategorySql(productFrontendCategotyId, productId, cate);
      sqlData.product_frontend_category = `${ProductFrontendCategotyInsertHead}\n${productFrontendCategorySqlData};`;

      /**
       * write skus
       */
      let skuCode = productCode + '01';
      let price = Math.ceil(parseFloat(data[4]) * 100);
      let skusSqlData = await createSkusSql(skuId, productId, skuCode, '', data[0], price, 1000, data[3]);
      sqlData.skus = `${SkusInsertHead}\n${skusSqlData};`;

      /**
       * write images
       */
      let iid = imageId;
      // console.log(info.imgs);
      let imgsTask = [];
      info.imgs.forEach((address, i) => {
        // console.log(`-------- run here ${i}-----------`);
        imgsTask.push(writeImage(address));
      });
      let imgPaths = await Promise.all(imgsTask);

      let imagesSqlWriteTask = [];
      imgPaths.forEach((path, i) => {
        imagesSqlWriteTask.push(createImagesSql(iid++, skuId, path, i + 1));
      });
      let imagesSqlData = await Promise.all(imagesSqlWriteTask);
      sqlData.images = ImagesInsertHead;
      imagesSqlData.forEach((data, i) => {
        sqlData.images += `\n${data}`;
        if (i === imagesSqlData.length - 1) {
          sqlData.images += ';';
        } else {
          sqlData.images += ',';
        }
      });

      /**
       * write properties and values
       */
      let prid = propertyId;
      let vid = valueId;
      let svid = skuValueId;
      let propertiesSqlData = '';
      let valuesSqlData = '';
      let skuValueSqlData = '';
      for (let i = 0; i < info.properties.length; i++) {
        let property = info.properties[i];
        // console.log(property);
        let cprid, cvid;
        cprid = await queryProperty(property.name);
        // console.log('current property id', cprid);
        if (!cprid) {
          cprid = prid++;
          cvid = vid++;
          propertiesSqlData += `\n${await createPropertiesSql(cprid, property.name)},`;
          valuesSqlData += `\n${await createValuesSql(cvid, cprid, property.value)},`;
        } else {
          cvid = await queryValue(cprid, property.value);
          if (!cvid) {
            cvid = vid++;
            valuesSqlData += `\n${await createValuesSql(cvid, cprid, property.value)},`;
          }
        }
        skuValueSqlData += `\n${await createSkuValueSql(svid++, skuId, cvid)},`;
      }
      // console.log(tmpSql.properties);
      if (propertiesSqlData) {
        propertiesSqlData = propertiesSqlData.substr(0, propertiesSqlData.length - 1) + ';';
        sqlData.properties = PropertiesInsertHead + propertiesSqlData;
      }
      if (valuesSqlData) {
        valuesSqlData = valuesSqlData.substr(0, valuesSqlData.length - 1) + ';';
        sqlData.values = ValuesInsertHead + valuesSqlData;
      }
      if (skuValueSqlData) {
        skuValueSqlData = skuValueSqlData.substr(0, skuValueSqlData.length - 1) + ';';
        sqlData.sku_value = SkuValueInsertHead + skuValueSqlData;
      }
    fs.appendFileSync('result/test.sql',
`
${sqlData.products}

${sqlData.product_frontend_category}

${sqlData.skus}

${sqlData.images}

${sqlData.properties}

${sqlData.values}

${sqlData.sku_value}
`
    );
      // console.log(sqlData);
      // console.log('-------- run here -----------');

      await transInsert(sqlData);

      /**
       * increase id
       */
      productId++;
      skuId++;
      productFrontendCategotyId++;
      propertyId = prid;
      imageId = iid;
      valueId = vid;
      skuValueId = svid;
      console.log('success: ', data[0]);
    } catch (err) {
      fs.appendFile('result/errors.txt', `\n${data[0]}\t${data[1]}\t${data[2]}\t${data[3]}\t${data[4]}`, err => {
        if (err) {
          console.log('errors text write fail', `\n${data[0]}\t${data[1]}\t${data[2]}\t${data[3]}\t${data[4]}`);
        }
      });
      log([data[0], err.message, err.stack]);
    }
  }
}

run();

// fetchList('javascript')
//   .then(res => {
//     getDataSku(res);
//   })
//   .catch(err => {
//     console.log(err.message);
//   });

// fetchWare(10951037)
//   .then(res => {
//     // console.log(res);
//     getInfo(res);
//   })
//   .catch(err => {
//     console.log(err.message);
//   });
