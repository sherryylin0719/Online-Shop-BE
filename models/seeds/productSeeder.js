const fetchData = require('./apiService')
const Category = require('../category')
const Product = require('../product')
const mongoose = require('mongoose')

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
    const productData = await fetchData('products')
    // create category data
    const categoryList =  await Category.find().lean()
    // create product data
    let newProducts = []
    for (let i = 0; i < productData.length; i++) {
      const categoryIndex = i % categoryList.length
      newProducts.push({
        title: productData[i].title,
        price: productData[i].price,
        category: categoryList[categoryIndex].category,
        description: productData[i].description,
        image: [{ url : productData[i].image, metadata: productData[i].title }],
      })
    }
    // insert data
    await Product.create(newProducts)
    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
