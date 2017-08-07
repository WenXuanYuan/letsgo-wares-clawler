import fs from 'fs';

/**
 * created and updated date
 */
let date = (new Date()).toLocaleString();
let reg = /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+) (\w)M/;
date = date.replace(reg, (date, $1, $2, $3, $4, $5, $6, $7) => {
  if ($7 === 'P') {
    $4 = String(parseInt($4) + 12);
  }
  return `${$3}-${$2.padStart(2, 0)}-${$1.padStart(2, 0)} ${$4.padStart(2, 0)}:${$5.padStart(2, 0)}:${$6.padStart(2, 0)}`;
});
// console.log(date);

export const ProductsInsertHead = 'INSERT INTO `products` (`id`, `shop_id`, `category_id`, `name`, `code`, `desc`, `created_at`, `updated_at`) VALUES';
export const ProductFrontendCategotyInsertHead = 'INSERT INTO `product_frontend_category` (`id`, `category_id`, `product_id`, `created_at`, `updated_at`) VALUES';
export const SkusInsertHead = 'INSERT INTO `skus` (`id`, `product_id`, `code`, `name`, `barcode`, `price`, `stock`, `unit`, `state`, `created_at`, `updated_at`) VALUES';
export const ImagesInsertHead = 'INSERT INTO `images` (`id`, `sku_id`, `path`, `number`, `created_at`, `updated_at`) VALUES';
export const PropertiesInsertHead = 'INSERT INTO `properties` (`id`, `name`, `type`, `desc`, `sort`, `created_at`, `updated_at`) VALUES';
export const ValuesInsertHead = 'INSERT INTO `values` (`id`, `property_id`, `name`, `sort`, `created_at`, `updated_at`) VALUES';
export const SkuValueInsertHead = 'INSERT INTO `sku_value` (`id`, `sku_id`, `value_id`, `created_at`, `updated_at`) VALUES';

export const createProductsSql = (id, name, code, desc) => new Promise((resolve, reject) => {
  let data = `(${id}, 1, NULL, '${name}', '${code}', '${desc}', '${date}', '${date}')`;
  fs.appendFile('result/products.sql', `\n${data},`, err => {
    err ? reject(err) : resolve(data);
  });
});

export const createProductFrontendCategorySql = (id, productId, categoryId = 173) => new Promise((resolve, reject) => {
  let data = `(${id}, ${categoryId}, ${productId}, '${date}', '${date}')`;
  fs.appendFile('result/product_frontend_category.sql', `\n${data},`, err => {
    err ? reject(err) : resolve(data);
  });
});

export const createSkusSql = (id, productId, code, name, barcode, price, stock, unit) => new Promise((resolve, reject) => {
  let data = `\n(${id}, ${productId}, '${code}', '${name}', '${barcode}', ${price}, ${stock}, '${unit}', 1, '${date}', '${date}')`;
  fs.appendFile('result/skus.sql', `\n${data},`, err => {
    err ? reject(err) : resolve(data);
  });
});

export const createImagesSql = (id, skuId, path, number) => new Promise((resolve, reject) => {
  let data = `(${id}, ${skuId}, '${path}', ${number}, '${date}', '${date}')`;
  fs.appendFile('result/images.sql', `\n${data},`, err => {
    err ? reject(err) : resolve(data);
  });
});

export const createPropertiesSql = (id, name) => new Promise((resolve, reject) => {
  let data = `(${id}, '${name}', 3, '${name}', 0, '${date}', '${date}')`;
  fs.appendFile('result/properties.sql', `\n${data},`, err => {
    err ? reject(err) : resolve(data);
  });
});

export const createValuesSql = (id, propertyId, name) => new Promise((resolve, reject) => {
  let data = `(${id}, ${propertyId}, '${name}', 0, '${date}', '${date}')`;
  fs.appendFile('result/values.sql', `\n${data},`, err => {
    err ? reject(err) : resolve(data);
  });
});

export const createSkuValueSql = (id, skuId, valueId) => new Promise((resolve, reject) => {
  let data = `(${id}, ${skuId}, ${valueId}, '${date}', '${date}')`;
  fs.appendFile('result/sku_value.sql', `\n${data},`, err => {
    err ? reject(err) : resolve(data);
  })
});
