const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : process.env.MONGODB_LOCALURI;

// mongodb connection
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, { useFindAndModify: false })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db