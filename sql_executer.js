import mysql from 'mysql';
import log from './log.js';

const database = 'letsgo';
const user = 'wenke';
const password = 'Xy_123456';

const connection = mysql.createConnection({
  user, password, database

});
connection.connect();

export const queryFrontendCategories = words => new Promise((resolve, reject) => {
  // console.log(words);
  let query = "SELECT `id`, `code`, `name`, `state` FROM `frontend_categories` WHERE (";
  let nameSearch = '';
  for (let i = 0; i < words.length; i++) {
    nameSearch += "`name` LIKE '%" + words[i] + "%'";
    if (i != words.length - 1) {
      nameSearch += " OR ";
    }
  }
  query += nameSearch + ") AND `state` = 1";
  // resolve(query);
  connection.query(query, (err, results) => {
    if (err) {
      reject(err);
    }

    if (results) {
      resolve(results);
    }
  });
});

// queryFrontendCategories(['方便', '书房', '水'])
//   .then(res => {
//     console.log(res[0].code);
//   })
//   .catch(err => {
//     console.log(err);
//   });

export const queryFrontendCategoryId = code => new Promise((resolve, reject) => {
  let start;
  if (code.endsWith('0000')) {
    start = code.substr(0, 2);
  } else {
    start = code.substr(0, 4);
  }

  let query = "SELECT `id` FROM `frontend_categories` WHERE `code` LIKE '";
  query += start + "%' AND `code` NOT LIKE '%00' AND `state` = 1 LIMIT 1";

  connection.query(query, (err, results) => {
    if (err) {
      reject(err);
    } else {
      // console.log(results);
      resolve(results[0].id)
    }
  })
});

// queryFrontendCategoryId('020000')
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });

export const queryProperty = name => new Promise((resolve, reject) => {
  let query = "SELECT `id` FROM `properties` WHERE `name` = '" + name + "'";
  connection.query(query, (err, results) => {
    if (err) {
      reject(err)
    }
    if (results.length === 0) {
      resolve(null);
    } else {
      resolve(results[0].id);
    }
  });
});

// queryProperty('品牌')
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });

export const queryValue = (propertyId, value) => new Promise((resolve, reject) => {

  let query = "SELECT `id` FROM `values` WHERE `property_id` = " + propertyId;
  query += " AND `name` = '" + value + "'";
  connection.query(query, (err, results) => {
    if (err) {
      reject(err);
    }
    if (results.length === 0) {
      resolve(null);
    } else {
      resolve(results[0].id);
    }
  });
});

// queryValue(1, '小米')
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });

export const transInsert = sql => new Promise((resolve, reject) => {
  let logData = Object.values(sql);
  connection.beginTransaction(err => {
    if (err) {
      log(logData);
      throw err;
    }
    connection.query(sql.products, err => {
      if (err) {
        return connection.rollback(() => {
          log(logData);
          throw err;
        });
      }
    });
    connection.query(sql.product_frontend_category, err => {
      if (err) {
        return connection.rollback(() => {
          log(logData);
          throw err;
        });
      }
    });
    connection.query(sql.skus, err => {
      if (err) {
        return connection.rollback(() => {
          log(logData);
          throw err;
        });
      }
    });
    connection.query(sql.images, err => {
      if (err) {
        return connection.rollback(() => {
          log(logData);
          throw err;
        });
      }
    });

    if (sql.properties) {
      connection.query(sql.properties, err => {
        if (err) {
          return connection.rollback(() => {
            log(logData);
            throw err;
          });
        }
      });
    }
    if (sql.values) {
      connection.query(sql.values, err => {
        if (err) {
          return connection.rollback(() => {
            log(logData);
            throw err;
          })
        }
      })
    }
    if (sql.sku_value) {
      connection.query(sql.sku_value, err => {
        if (err) {
          return connection.rollback(() => {
            log(logData);
            throw err;
          });
        }
      });
    }
    connection.commit(err => {
      if (err) {
        log(logData);
        throw err;
      } else {
        resolve('success');
      }
    });
  });
});

// let products = "INSERT INTO `products` (`id`, `shop_id`, `category_id`, `name`, `code`, `desc`, `created_at`, `updated_at`) VALUES";
// products += "(1, 1, NULL, 'G7三合一咖啡', '0001000001', '规格: 800G', '2017-07-08 20:03:59', '2017-07-08 20:03:59');";

// let product_frontend_category = "INSERT INTO `product_frontend_category` (`id`, `category_id`, `product_id`, `created_at`, `updated_at`) VALUES";
// product_frontend_category += "(1, 373, 1, '2017-07-08 20:03:59', '2017-07-08 20:03:59');";

// let skus = "INSERT INTO `skus` (`id`, `product_id`, `code`, `name`, `barcode`, `price`, `stock`, `unit`, `state`, `created_at`, `updated_at`) VALUES";
// skus += "(1, 1, '000100000101', '', '8935024129357', 3980, 1000, '包', 1, '2017-07-08 20:03:59', '2017-07-08 20:03:59');";

// let images = "INSERT INTO `images` (`id`, `sku_id`, `path`, `number`, `created_at`, `updated_at`) VALUES";
// images += "(1, 1, '2017-07-08/1502107440570885.png', 1, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// images += "(2, 1, '2017-07-08/1502107440575297.png', 2, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// images += "(3, 1, '2017-07-08/1502107440576747.png', 3, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// images += "(4, 1, '2017-07-08/1502107440578995.png', 4, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// images += "(5, 1, '2017-07-08/1502107440619830.png', 5, '2017-07-08 20:03:59', '2017-07-08 20:03:59');";

// let properties = "INSERT INTO `properties` (`id`, `name`, `type`, `desc`, `sort`, `created_at`, `updated_at`) VALUES";
// properties += "(1, '品牌', 3, '品牌', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// properties += "(2, '商品名称', 3, '商品名称', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// properties += "(3, '商品毛重', 3, '商品毛重', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// properties += "(4, '商品产地', 3, '商品产地', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// properties += "(5, '容量', 3, '容量', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// properties += "(6, '包装单位', 3, '包装单位', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// properties += "(7, '产品产地', 3, '产品产地', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// properties += "(8, '咖啡分类', 3, '咖啡分类', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59');";

// let values = "INSERT INTO `values` (`id`, `property_id`, `name`, `sort`, `created_at`, `updated_at`) VALUES";
// values += "(1, 1, '中原（TRUNG NGUYEN）', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// values += "(2, 2, '中原咖啡', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// values += "(3, 3, '1.8kg', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// values += "(4, 4, '越南', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// values += "(5, 5, '1L及以上', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// values += "(6, 6, '盒装', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// values += "(7, 7, '越南', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// values += "(8, 8, '速溶咖啡', 0, '2017-07-08 20:03:59', '2017-07-08 20:03:59');";

// let sku_value = "INSERT INTO `sku_value` (`id`, `sku_id`, `value_id`, `created_at`, `updated_at`) VALUES";
// sku_value += "(1, 1, 1, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// sku_value += "(2, 1, 2, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// sku_value += "(3, 1, 3, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// sku_value += "(4, 1, 4, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// sku_value += "(5, 1, 5, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// sku_value += "(6, 1, 6, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// sku_value += "(7, 1, 7, '2017-07-08 20:03:59', '2017-07-08 20:03:59'),";
// sku_value += "(8, 1, 8, '2017-07-08 20:03:59', '2017-07-08 20:03:59');";

// let sql = { products, product_frontend_category, skus, images, properties, values, sku_value };
// transInsert(sql)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
