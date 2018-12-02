const fetch = require('node-fetch')
const fs = require('fs')

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

let store = (format, cards) => {
  let buffer = {
    date: Date.now(),
    cards: cards
  }
  let data = JSON.stringify(buffer)
  fs.writeFileSync(`./${format}.json`, data)
}

let read = (format) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./${format}.json`, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('No cache found. Creating cache file on disk.')
          resolve({cards: [], date: 0})
          return
        }
        reject(err)
        return
      }
      let buffer = JSON.parse(data)
      resolve(buffer)
    })
  })
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

let promise = (format) => {
  return new Promise((resolve, reject) => {
    read(format).then(buffer => {
      let bufferAge = (Date.now() - buffer.date) / 1000.0
      console.log(`Cache age: ${bufferAge}`)
      if (bufferAge < 60) {
        console.log(`Using cached response`)
        resolve(buffer.cards)
        return
      }
      fetch(`https://www.mtggoldfish.com/movers/paper/${format}`)
          .then(res => res.text())
          .then(body => {
            let cards = parseCards(body)
            store(format, cards)
            resolve(cards)
          })
    })
  })
}

module.exports = {
  standard: promise(formats.standard),
  modern: promise(formats.modern),
  vintage: promise(formats.vintage),
  pauper: promise(formats.pauper),
  legacy: promise(formats.legacy)
}
