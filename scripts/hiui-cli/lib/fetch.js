const https = require('https')
const http = require('http')
const { URL } = require('url')

function fetchText (url, options = {}) {
  const { timeout = 30000, redirect = 5 } = options

  return new Promise((resolve, reject) => {
    let currentUrl = url
    let redirectsLeft = redirect

    const requestOnce = () => {
      const parsed = new URL(currentUrl)
      const lib = parsed.protocol === 'https:' ? https : http

      const req = lib.get(
        currentUrl,
        {
          headers: {
            Accept: 'text/plain, text/markdown, */*',
            'User-Agent': '@hi-ui/hiui-cli',
          },
        },
        (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            if (redirectsLeft <= 0) {
              reject(new Error(`Too many redirects for ${url}`))
              res.resume()
              return
            }
            redirectsLeft -= 1
            currentUrl = new URL(res.headers.location, currentUrl).toString()
            res.resume()
            requestOnce()
            return
          }

          if (res.statusCode !== 200) {
            const err = new Error(
              `Request failed: ${res.statusCode} ${res.statusMessage}`
            )
            err.statusCode = res.statusCode
            err.url = currentUrl
            res.resume()
            reject(err)
            return
          }

          const chunks = []
          res.on('data', (chunk) => chunks.push(chunk))
          res.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf8'))
          })
        }
      )

      req.setTimeout(timeout, () => {
        req.destroy(new Error(`Request timeout: ${currentUrl}`))
      })

      req.on('error', reject)
    }

    requestOnce()
  })
}

module.exports = {
  fetchText,
}
