const mysql = require('mysql');

const database = 'letsgo';
const user = 'wenke';
const password = 'Xy_123456';

const client = mysql.createConnection({
  user, password, database

});
client.connect();

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
  client.query(query, (err, results) => {
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

  client.query(query, (err, results) => {
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
  client.query(query, (err, results) => {
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
  client.query(query, (err, results) => {
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
