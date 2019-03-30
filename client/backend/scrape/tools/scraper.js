/* eslint no-console: 0 */ 
const Extractor = require('./extractor')
const https = require('./fetchers/https')
const scriptTag = require('./fetchers/scriptTag')

var Scraper = function (config) {
  this.noOfTweets = config.noOfTweets
  this.url = config.url
  this.extractor = new Extractor(config)

  if (!config.browser) this.fetch = https
  else {
    this.fetch = scriptTag.fetch
    window.__twttr = scriptTag
  }
}

Scraper.prototype.getTweets = function (tweets) {
  var self = this

  return new Promise(function (resolve, reject) {
    // base case
    if (tweets.length >= self.noOfTweets) {
      resolve(tweets)
      return
    }

    self.fetch(self.url)
      .then(function (request) {
        if(!request.body) {
          console.log('Failed a request! Url: ' + self.url);
          resolve(tweets)
          return
        }
        var extracted = self.extractor.extract(request.body)
        if (extracted.length === 0) { resolve(tweets); return } // BREAK IF NO MORE TWEETS!!!
        tweets = tweets.concat(extracted)

        self.url = updateUrl(self.url, request.headers.minPosition)
        self.getTweets(tweets)
          .then(function (recursiveTweets) {
            resolve(recursiveTweets)
          })
          .catch(function (err){
            console.log('Couldn\'t extract from: ' + self.url + '\n' + err);
            resolve(tweets);
          })
      })
  })
}

function updateUrl (url, position) {
  var splitted = url.split('&')

  if (splitted[splitted.length - 1].slice(0, 12) === 'max_position') { url = url.slice(0, url.length - (splitted[splitted.length - 1].length + 1)) }

  url += '&max_position=' + position
  return url
}

module.exports = Scraper
