const mongoose = require('mongoose')
const Category = require('../category')

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

    // create category data
    const categoryData = [
      { category: 'Top' },
      { category: 'Bottom' },
      { category: 'OnePiece' },
      { category: 'Suit' },
      { category: 'Accessory' }
    ]

    // insert data
    await Category.create(categoryData)
    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
