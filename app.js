if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require("method-override")
const passport = require('./config/passport')
const bodyParser = require("body-parser")
const apiRouter = require('./routes')
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(passport.initialize())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello world')
})
app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})