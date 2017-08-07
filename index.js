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
  queryValue
} from './sql_executer.js';
import read from './read.js';
import fs from 'fs';
import log from './log.js';
const file = 'wares.txt';

let productId = 1;
let skuId = 1;
let productFrontendCategotyId = 1;
let propertyId = 1;
let imageId = 1;
let valueId = 1;
let skuValueId = 1;


read(file, async line => {
  let data = line.split(/\s+/);
  // data: barcode, name, guige, unit, price
  // console.log(data);
  try {
    let sqlData = {};
    let tmpSql;
    let listHtml = await fetchList(data[1]);
    // console.log(listHtml);
    let dataSku = getDataSku(listHtml);
    if (!dataSku) {
      // wares not found
      throw new Error('1');
    }
    // console.log(dataSku);

    let infoHtml = await fetchWare(dataSku);
    let info = getInfo(infoHtml);
    // console.log(info);

    /**
     * write product
     */
    let productCode = '0001' + String(productId).padStart(6, 0);
    tmpSql = await createProductsSql(productId, data[1], productCode, '规格: ' + data[2]);
    sqlData.products = `${ProductsInsertHead}\n${tmpSql};`;

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
    tmpSql = await createProductFrontendCategorySql(productFrontendCategotyId, productId, cate);
    sqlData.product_frontend_category = `${ProductFrontendCategotyInsertHead}\n${tmpSql};`;

    /**
     * write skus
     */
    let skuCode = productCode + '01';
    let price = Math.ceil(parseFloat(data[4]) * 100);
    tmpSql = await createSkusSql(skuId, productId, skuCode, '', data[0], price, 1000, data[3]);
    sqlData.skus = `${SkusInsertHead}\n${tmpSql};`;

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
    tmpSql = ImagesInsertHead;
    imagesSqlData.forEach((data, i) => {
      tmpSql += `\n${data}`;
      if (i === imagesSqlData.length - 1) {
        tmpSql += ';';
      } else {
        tmpSql += ',';
      }
    });
    sqlData.images = tmpSql;

    /**
     * write properties and values
     */
    let prid = propertyId;
    let vid = valueId;
    let svid = skuValueId;
    tmpSql = {
      properties: '',
      values: '',
      sku_value: ''
    };
    for (let i = 0; i < info.properties.length; i++) {
      let property = info.properties[i];
      let cprid, cvid, hasNewProperty = false, hasNewValue = false;
      cprid = await queryProperty(property.name);
      if (!cprid) {
        cprid = prid++;
        cvid = vid++;
        hasNewProperty = true;
        hasNewValue = true;
        tmpSql.properties += `\n${await createPropertiesSql(cprid, property.name)}`;
        tmpSql.values += `\n${await createValuesSql(cvid, cprid, property.value)}`;
      } else {
        cvid = await queryValue(cprid, property.value);
        if (!cvid) {
          hasNewValue = true;
          cvid = vid++;
          tmpSql.values += `\n${await createValuesSql(cvid, cprid, property.value)}`;
        }
      }
      tmpSql.sku_value += `\n${await createSkuValueSql(svid++, skuId, cvid)}`;
      if (i === info.properties.length - 1) {
        if (hasNewProperty) {
          tmpSql.properties += ';';
        }
        if (hasNewValue) {
          tmpSql.values += ';';
        }
        tmpSql.sku_value += ';';
      } else {
        if (hasNewProperty) {
          tmpSql.properties += ',';
        }
        if (hasNewValue) {
          tmpSql.values += ',';
        }
        tmpSql.sku_value += ',';
      }
    }
    // console.log(tmpSql.properties);
    if (tmpSql.properties) {
      sqlData.properties = PropertiesInsertHead + tmpSql.properties;
    }
    if (tmpSql.values) {
      sqlData.values = ValuesInsertHead + tmpSql.values;
    }
    if (tmpSql.sku_value) {
      sqlData.sku_value = SkuValueInsertHead + tmpSql.sku_value;
    }
    fs.writeFileSync('result/test.sql',
`${sqlData.products}

${sqlData.product_frontend_category}

${sqlData.skus}

${sqlData.images}

${sqlData.properties}

${sqlData.values}

${sqlData.sku_value}`
    );
    console.log(sqlData);
    // console.log('-------- run here -----------');

    /**
     * increase id
     */
    productId++;
    skuId++;
    productFrontendCategotyId++;
    propertyId = prid;
    imageId = iid;
    valueId = vid;
    skuValueId = skuValueId;

  } catch (err) {
    fs.appendFile('result/errors.txt', `\n${data[0]}\t${data[1]}\t${data[2]}\t${data[3]}\t${data[4]}`, err => {
      if (err) {
        console.log('errors text write fail', `\n${data[0]}\t${data[1]}\t${data[2]}\t${data[3]}\t${data[4]}`);
      }
    });
    log([data[0], err.message, err.stack]);
  }
});


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
