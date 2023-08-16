const db = require('../../config/mongoose')
const Category = require('../category')

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
