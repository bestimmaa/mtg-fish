const fs = require('fs')

// Use a json file in /data to cache responses
let fileSystemStore = (format, cards) => {
  return new Promise((resolve, reject) => {
    let buffer = {
      date: Date.now(),
      cards: cards
    }
    let data = JSON.stringify(buffer)
    fs.writeFileSync(`./data/${format}.json`, data)
    resolve(true)
  })
}

  // Read from json file in /data to get cached responses
let fileSystemRead = (format) => {
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

module.exports = {
  fileSystemRead,
  fileSystemStore
}
