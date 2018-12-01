const fetch = require('node-fetch')
const fs = require('fs')

// https://regex101.com/r/0blx1P/4
let regexStringValue = '<td.*>(.+)<\\\/td>\\s+<td.*>\\s+<div.*>\\s+<span.*>(.+)<\\\/span>\\s+<span.*<\\\/span>\\s+<\\\/div>\\s+<\\\/td>\\s+<td>.*<\\\/td>\\s+<td>\\s+<a data-full-image=\".+\" rel=\"popover\" data-trigger=\"hover\" data-html=\"true\" href=\".+\">(.+)<\\\/a>\\s+<\\\/td>\\s+<td.*>\\s+<span.*>(.*)<\\\/span>\\s+<\\\/td>\\s+<td.*>\\s<span.*>(.+)<\\\/span>'

let regex = new RegExp(regexStringValue, 'g')
let regex2 = new RegExp(regexStringValue, '')

let store = cards => {
  let buffer = {
    date: Date.now(),
    cards: cards
  }
  let data = JSON.stringify(buffer)
  fs.writeFileSync('./buffer.json', data)
}

let read = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./buffer.json', (err, data) => {
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

let parse_cards = (body) => {
  var result = body.match(regex)
  var cards = []
  for (var i = 0; i < result.length; ++i) {
    var cardResult = result[i].match(regex2)
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

let promise = new Promise((resolve, reject) => {
  read().then(buffer => {
    let bufferAge = (Date.now() - buffer.date) / 1000.0
    console.log(`Cache age: ${bufferAge}`)
    if (bufferAge < 60) {
      console.log(`Using cached response`)
      resolve(buffer.cards)
      return
    }
    fetch('https://www.mtggoldfish.com/movers/paper/standard')
          .then(res => res.text())
          .then(body => {
            let cards = parse_cards(body)
            store(cards)
            resolve(cards)
          })
  })
})

module.exports = {
  movers_shakers: promise
}
