let mtgGoldfish = require('./index.js')
const fs = require('fs')

// Custom cache write function
let exampleCacheWrite = (format, cards) => {
    // Make sure to return a promise like this
  return new Promise((resolve, reject) => {
    let buffer = {
    // Set the date to current date!
      date: Date.now(),
    // The cards for this format
      cards: cards
    }
    let data = JSON.stringify(buffer)
    fs.writeFileSync(`./data/${format}.json`, data)
    resolve(true)
  })
}

// Custom cache read function
let exampleCacheRead = (format) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./data/${format}.json`, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      let buffer = JSON.parse(data)
      resolve(buffer)
    })
  })
}

// Assign the cache functions (optional). If not configured a default file based cache is used
mtgGoldfish.configureCache(exampleCacheRead, exampleCacheWrite)

// Get all cards from movers and shakers section for a format
//
// Use cards.slice 0,10, 10,20 20,30 30,40 for daily winner, daily looser, weekly winner, weekly loser
//
// Example:
// [{'name': 'Tarmogoyf', 'position': '1', 'price': '89.25', 'delta_relative': '+1.00%', 'delta_absolute': '+1.26'}, (...)]

mtgGoldfish.movers_shakers(mtgGoldfish.formats.legacy).then(cards => console.log(cards.slice(0, 10)))
