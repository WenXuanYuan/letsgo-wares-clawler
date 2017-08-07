import fs from 'fs';
import cheerio from 'cheerio';

export const getDataSku = text => {
  // console.log(text);

  // console.log(typeof text);

  // fs.writeFile('data/list.html', text, err => {
  //   if (err) {
  //     console.log(err.message);
  //   }
  // });

  // let reg = /data-sku=\"(\d+)\"/;
  // let found = text.match(reg);

  // console.log(found[1]);
  // return found[1];

  const $ = cheerio.load(text);
  let dataSku = $('#J_goodsList>ul').children('li').first().data('sku');

  return dataSku;
};

// fs.readFile('data/list.html', {
//   encoding: 'utf8',
// }, (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     let skuData = getDataSku(data);
//     console.log(skuData);
//     // 10951037
//   }
// });

export const getInfo = text => {
  // console.log(text);

  // fs.writeFile('data/item.html', text, err => {
  //   if (err) {
  //     console.log(err.message);
  //   }
  // });
  // return;

  // console.log(text);
  // return;

  const $ = cheerio.load(text);

  /**
   * properties
   */
  let properties = [];
  // let propertyList = $('ul.p-parameter-list>li');
  // console.log(propertyList.length);   12
  // console.log(propertyList[0].tagName);
  // console.log(propertyList[11].tagName);

  $('ul.p-parameter-list>li').each(function (i, li) {
    let property = {};
    let name = $(this).text().split('：')[0];
    if (name !== '商品编号') {
      property.value = $(this).attr('title');
      property.name = name;
      properties.push(property);
    }
  });
  // return properties;

  /**
   * category
   */
  let cate = $('#crumb-wrap>div').text();
  if (!cate) {
    cate = $('#root-nav>div').text();
  }
  cate = cate.replace(/(\s)/g, '');
  cate = cate.split('>');
  let cateWords = [];
  cate.forEach(v => {
    let loop = Math.ceil(v.length / 2);
    for (let i = 0; i < loop; i++) {
      cateWords.push(v.substr(2 * i, 2));
    }
  })
  // return words;

  /**
   * image path
   */
  let imgElems = $('.spec-items img');
  let imgs = [];
  imgElems.each(function (i, img) {
    imgs.push('http:' + $(this).attr('src').replace('n5', 'n1'));
    if (i === 4) {
      return false;
    }
  });
  // return imgs;

  return { cateWords, properties, imgs };
};

// fs.readFile('data/item.html', {
//   encoding: 'utf8',
// }, (err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     let valueText = getInfo(data);
//     console.log(valueText);
//   }
// });

export const getCategories = cates => {
  let cate1, cate2, cate3;
  // console.log(cates);
  // console.log(cates.length);
  // console.log(cates instanceof Array);
  for (let i = 0; i < cates.length; i++) {
    let code = cates[i].code;
    // console.log(code);
    if (code.endsWith('0000')) {
      // console.log('level1', code);
      cate1 = code;
    } else if (code.endsWith('00')) {
      // console.log('level2', code);
      cate2 = code;
    } else {
      // console.log('level3', code);
      cate3 = cates[i].id;
      break;
    }
  }
  return { cate1, cate2, cate3 };
};
