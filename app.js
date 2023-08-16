if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const methodOverride = require("method-override")
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

// mongodb connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})