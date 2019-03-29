const Scraper = require('./tools/scraper')
const config = require('./config')

function extract (userConfig) {
  return new Promise(function (resolve, reject) {
    var alltweets = {}

    userConfig.profiles.forEach(profile => {
      var appConfig = config.getConfig(userConfig)
      appConfig.profile = profile
      appConfig.url = config.getUrl(appConfig)

      if (!appConfig.url) reject(new Error('Invalid configuration!'))

      var scraper = new Scraper(appConfig)

      var tweets = []
      scraper.getTweets(tweets)
        .then(tweets => {
          alltweets[profile] = tweets.slice(0, appConfig.noOfTweets)

          if (checkIfFinished(userConfig, alltweets)) resolve(alltweets)
        })
    })
  })
}

function checkIfFinished (userConfig, alltweets) {
  var isFinished = true
  userConfig.profiles.forEach(profile => {
    if (!alltweets[profile]) isFinished = false
  })
  return isFinished
}

// if run in browser register the method for use
if ((typeof window !== 'undefined')) window.extract = extract
module.exports = extract
