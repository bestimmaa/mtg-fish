const fetch = require('node-fetch')

// https://regex101.com/r/0blx1P/4
let regexStringValue = '<td.*>(.+)<\\\/td>\\s+<td.*>\\s+<div.*>\\s+<span.*>(.+)<\\\/span>\\s+<span.*<\\\/span>\\s+<\\\/div>\\s+<\\\/td>\\s+<td>.*<\\\/td>\\s+<td>\\s+<a data-full-image=\".+\" rel=\"popover\" data-trigger=\"hover\" data-html=\"true\" href=\".+\">(.+)<\\\/a>\\s+<\\\/td>\\s+<td.*>\\s+<span.*>(.*)<\\\/span>\\s+<\\\/td>\\s+<td.*>\\s<span.*>(.+)<\\\/span>'

let regex = new RegExp(regexStringValue, 'g')
let regex2 = new RegExp(regexStringValue, '')

let promise = new Promise((resolve, reject) => {
  fetch('https://www.mtggoldfish.com/movers/paper/standard')
  .then(res => res.text())
  .then(body => {
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
    return resolve(cards)
  })
})

module.exports = {movers_shakers: promise}
