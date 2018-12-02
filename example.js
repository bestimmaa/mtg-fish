let mtgGoldfish = require('./index.js')

// Daily winners
mtgGoldfish.standard.then(cards => console.log(cards.slice(0, 10)))

// Daily losers
mtgGoldfish.pauper.then(cards => console.log(cards.slice(10, 20)))

// Weekly winner
mtgGoldfish.legacy.then(cards => console.log(cards.slice(20, 30)))

// Weekly losers
mtgGoldfish.modern.then(cards => console.log(cards.slice(30, 40)))
