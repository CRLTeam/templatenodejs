const mongoose = require('mongoose')

// let address = 'mongodb://127.0.0.1:27017/';
let address = 'mongodb://volod:cybersecurityisfun@35.203.22.195:27017';

mongoose
    .connect(address, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db