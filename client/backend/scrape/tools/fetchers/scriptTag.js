var result = {}

var scriptFetcher = {
  fetch: function (url) {
    return new Promise(function (resolve, reject) {
      var head = document.getElementsByTagName('head')[0]
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = url
      script.addEventListener('load', () => {
        resolve(result)
      })
      head.appendChild(script)
    })
  },
  callback: function (data) {
    result = data
  }
}

module.exports = scriptFetcher
