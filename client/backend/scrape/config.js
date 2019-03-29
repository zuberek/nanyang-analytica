const BASE_URL = 'https://syndication.twitter.com/timeline/'
const BASE_PARAMS = '?callback=__twttr.callback&dnt=false&suppress_response_codes=true&rnd=' + Math.random()

function getConfig (cfg) {
  var config = {}
  config.showAuthor = (cfg.showAuthor) ? cfg.showAuthor : true
  config.showRetweets = (cfg.showRetweets) ? cfg.showRetweets : true
  config.showMedia = (cfg.showMedia) ? cfg.showMedia : true
  config.noOfTweets = (cfg.noOfTweets) ? cfg.noOfTweets : 20
  config.browser = (typeof window !== 'undefined')
  return config
}

function getUrl (cfg) {
  var url = ''
  if (cfg.profile) url = profileUrl(cfg.profile)
  if (cfg.likes) url = likesUrl(cfg.profile)
  if (cfg.list) url = listUrl(cfg.list.profile, cfg.list.list)
  return url
}

function profileUrl (profile) {
  return BASE_URL + 'profile' + BASE_PARAMS + '&screen_name=' + profile
}
function likesUrl (profile) {
  return BASE_URL + 'likes' + BASE_PARAMS + '&screen_name=' + profile
}
function listUrl (profile, list) {
  return BASE_URL + 'list' + BASE_PARAMS + '&screen_name=' + profile + '&list_slug=' + list
}

module.exports = {
  getConfig,
  getUrl
}
