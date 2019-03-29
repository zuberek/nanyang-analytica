const cheerio = require('cheerio')

var Extractor = function (config) {
  this.showAuthor = config.showAuthor
  this.showRetweets = config.showRetweets
  this.showMedia = config.showMedia
}

Extractor.prototype.extract = function (body) {
  const $ = cheerio.load(body)
  var tweets = []
  var self = this

  $.root().find('.timeline-Tweet').map(function (i, el) {
    // $(this) === el (single raw tweet)

    var tweet = {}

    // Check if is retweet
    if ($(this).find('.timeline-Tweet-retweetCredit').length > 0) {
      tweet.isRetweet = true
    } else {
      tweet.isRetweet = false
    }

    if (!tweet.isRetweet || (tweet.isRetweet && self.showRetweets)) {
      tweet.id = $(this).attr('data-tweet-id')
      tweet.body = $(this).find('.timeline-Tweet-text').text()
      tweet.time = $(this).find('.dt-updated').text().slice(6)
      tweet.timestamp = $(this).find('.dt-updated').attr('datetime')
      tweet.link = $(this).find('.timeline-Tweet-timestamp').attr('href')
      if (self.showAuthor) {
        var rawAuthor = $(this).find('.timeline-Tweet-author')
        tweet.author = {}
        tweet.author.name = rawAuthor.find('.TweetAuthor-name').text()
        tweet.author.username = rawAuthor.find('.TweetAuthor-screenName ').text()
        tweet.author.link = rawAuthor.find('.TweetAuthor-link').attr('href')
        tweet.author.img = rawAuthor.find('.Avatar').attr('data-src-2x')
      }
      if (self.showMedia) {
        var rawMedia = $(this).find('.timeline-Tweet-media')
        if (rawMedia.hasClass('timeline-Tweet-media')) {
          tweet.media = []
          rawMedia.find('img').map(function (i, el) {
            if ($(this).attr('data-image')) { tweet.media.push($(this).attr('data-image') + '?format=jpg&name=large') }
          })
          if (tweet.media.length === 0) delete tweet.media
        }
      }
    }
    tweets.push(tweet)
  })
  return tweets
}

module.exports = Extractor
