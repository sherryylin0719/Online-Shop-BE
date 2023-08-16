const fetchData = require('./apiService')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const User = require('../user')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// mongodb connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async () => {
  try {
    console.log('mongodb connected!')
    // axios get data
    const userData = await fetchData('users?limit=5')
    // create user data
    let newUsers = [{
      name: 'root',
      email: 'root@example.com',
      password: '12345678',
      role: 'admin',
    }]
    for (let i = 0; i < userData.length; i++) {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(userData[i].password, salt)
      newUsers.push({
        name: userData[i].username,
        email: userData[i].email,
        password: hash
      })
    }
    // insert data
    await User.create(newUsers)
    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
