const http = require('http');
const https = require('https');

function validateURL(url) {
  const client = (url.includes('https') ? https : http);
  return new Promise((reslove, reject) => {
    client.get(url, response => {
      const { statusCode } = response;
      (statusCode < 400) ? reslove(true) : reslove(false);
    }).on('error', e => {
      reject(false);
    });
  });
}

module.exports = validateURL;