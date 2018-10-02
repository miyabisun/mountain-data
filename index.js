const _ = require('lodash');
const rp = require('request-promise');
const encoding = require('encoding-japanese');

rp({url: 'http://www.gsi.go.jp/KOKUJYOHO/MOUNTAIN/data.js', encoding: null})
  .then(buf => {
    const html = encoding.convert(buf, {from: 'SJIS', to: 'UNICODE', type: 'string'});
    const csv = _.chain(html)
      .split('\n')
      .filter(it => it.match(/^mountain/))
      .map(it => it
        .replace(/\mountain\[\d+\]='/, '')
        .replace(/';\r$/, '')
        .split(',')
      )
      .map(datum => _.zipObject(['ID', 'B', 'L', 'H', '山名', 'やまめい', '山頂名', 'さんちょうめい', '点名等', '備考', '所在', '県名１', '県名２', '県名３'], datum))
      .value();
    const output = process.argv[2] === 'min'
      ? JSON.stringify(csv)
      : JSON.stringify(csv, null, 2);
    console.log(output);
  })
  .catch(console.error);
