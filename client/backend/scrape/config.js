const BASE_URL = 'https://syndication.twitter.com/timeline/'
const BASE_PARAMS = '?callback=__twttr.callback&dnt=false&suppress_response_codes=true&rnd=' + Math.random()

function getConfig (cfg) {
  var config = {}
  config.showAuthor = (typeof cfg.showAuthor !== 'undefined') ? cfg.showAuthor : true
  config.showRetweets = (typeof cfg.showRetweets !== 'undefined') ? cfg.showRetweets : true
  config.showMedia = (typeof cfg.showMedia !== 'undefined') ? cfg.showMedia : true
  config.noOfTweets = (cfg.noOfTweets) ? cfg.noOfTweets : 20
  config.browser = (typeof window !== 'undefined')
  config.lang = (cfg.lang) ? cfg.lang : 'en'
  return config
}

function getUrl (cfg) {
  var url = ''
  if (cfg.profile) url = profileUrl(cfg)
  if (cfg.likes) url = likesUrl(cfg)
  if (cfg.list) url = listUrl(cfg)
  return url
}

function profileUrl (cfg) {
  return BASE_URL + 'profile' + BASE_PARAMS + '&screen_name=' + cfg.profile + '&lang=' + cfg.lang
}
function likesUrl (cfg) {
  return BASE_URL + 'likes' + BASE_PARAMS + '&screen_name=' + cfg.profile + '&lang=' + cfg.lang
}
function listUrl (cfg) {
  return BASE_URL + 'list' + BASE_PARAMS + '&screen_name=' + cfg.profile + '&list_slug=' + cfg.list + '&lang=' + cfg.lang
}

module.exports = {
  getConfig,
  getUrl
}
