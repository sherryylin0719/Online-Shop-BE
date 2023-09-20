if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const passport = require('./config/passport')
const bodyParser = require("body-parser")
const cors = require('cors')
const apiRouter = require('./routes')
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT || 3000

// cors
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Authorization,Content-Type'
}
app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(express.json())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))

app.get('/', (req, res) => {
  res.send('hello world')
})
app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})