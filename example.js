let mtgGoldfish = require('./index.js')

// Daily winners
mtgGoldfish.standard.then(cards => console.log(cards.slice(0, 10)))

mtgGoldfish.pauper.then(cards => console.log(cards.slice(0, 10)))

mtgGoldfish.legacy.then(cards => console.log(cards.slice(0, 10)))

mtgGoldfish.modern.then(cards => console.log(cards.slice(0, 10)))

mtgGoldfish.vintage.then(cards => console.log(cards.slice(0, 10)))
