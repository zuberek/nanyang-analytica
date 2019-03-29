const https = require('https')

function fetch (url) {
  return new Promise(function (resolve, reject) {
    var req = https.get(url, function (res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode))
      }
      res.setEncoding('utf8')
      let body = ''
      res.on('data', function (chunk) {
        body += chunk
      })
      res.on('end', function () {
        try {
          body = JSON.parse(body.slice(21, body.length - 2))
        } catch (e) {
          reject(e)
        }
        resolve(body)
      })
    })
    // reject on request error
    req.on('error', function (err) {
      reject(err)
    })
    // IMPORTANT
    req.end()
  })
}

module.exports = fetch
