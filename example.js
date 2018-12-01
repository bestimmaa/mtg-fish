let mtgGoldfish = require('./index.js')

// Daily winners
mtgGoldfish.movers_shakers.then(cards => console.log(cards.slice(0, 10)))
