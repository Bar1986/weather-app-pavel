const request = require('request')

const doRequest = function (url){
    return new Promise(function (resolve, reject) {
      request({url, json: true}, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      })
    })
  }

  module.exports = doRequest