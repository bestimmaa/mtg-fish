const fetch = require('node-fetch')
const fileSystemCache = require('./filesystemCache')

let formats = {
  standard: 'standard',
  modern: 'modern',
  pauper: 'pauper',
  vintage: 'vintage',
  legacy: 'legacy'
}

// https://regex101.com/r/0blx1P/4
let regexStringValue = '<td.*>(.+)<\\\/td>\\s+<td.*>\\s+<div.*>\\s+<span.*>(.+)<\\\/span>\\s+<span.*<\\\/span>\\s+<\\\/div>\\s+<\\\/td>\\s+<td>.*<\\\/td>\\s+<td>\\s+<a data-full-image=\".+\" rel=\"popover\" data-trigger=\"hover\" data-html=\"true\" href=\".+\">(.+)<\\\/a>\\s+<\\\/td>\\s+<td.*>\\s+<span.*>(.*)<\\\/span>\\s+<\\\/td>\\s+<td.*>\\s<span.*>(.+)<\\\/span>'

let regexGlobal = new RegExp(regexStringValue, 'g')
let regex = new RegExp(regexStringValue, '')

// Read from cache with (format, cards) => {...}
var cacheRead = fileSystemCache.fileSystemRead
// Store to cache with  (format) => {...}
var cacheWrite = fileSystemCache.fileSystemStore

let configureCache = (read, write) => {
  cacheRead = read
  cacheWrite = write
}

let parseCards = (body) => {
  var result = body.match(regexGlobal)
  var cards = []
  for (var i = 0; i < result.length; ++i) {
    var cardResult = result[i].match(regex)
    var card = {
      name: cardResult[3],
      position: cardResult[1],
      price: cardResult[4],
      delta_relative: cardResult[5],
      delta_absolute: cardResult[2]
    }
    cards.push(card)
  }
  return cards
}

// Download cards for format from network and pass them to resolve if successful. Otherwise an error is passed to reject.
// In case of success the cards are also persisted to the cache.
let fetchAndCacheCards = (format, resolve, reject) => {
  fetch(`https://www.mtggoldfish.com/movers/paper/${format}`)
  .then(res => res.text())
  .then(body => {
    let cards = parseCards(body)
    cacheWrite(format, cards).then(result => resolve(cards))
  })
  .catch(err => reject(err))
}

let movers_shakers = (format) => {
  return new Promise((resolve, reject) => {
    console.log(`Requesting winners / losers for ${format}`)
    cacheRead(format).then(buffer => {
      let bufferAge = (Date.now() - buffer.date) / 1000.0
      if (bufferAge < 60) {
        console.log(`Cache is fresh. Using cached response for ${format}`)
        resolve(buffer.cards)
      } else {
        console.log(`Cache is stale for ${format}`)
        fetchAndCacheCards(format, resolve, null)
      }
    }).catch(err => {
      if (err.code === 'ENOENT') {
        console.log(`No cache file found for ${format}`)
        fetchAndCacheCards(format, resolve, null)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  formats,
  movers_shakers,
  configureCache
}
