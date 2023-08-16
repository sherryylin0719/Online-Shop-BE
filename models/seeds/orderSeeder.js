const fetchData = require('./apiService')
const Product = require('../product')
const mongoose = require('mongoose')
const Order = require('../order')
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
    const orderData = await fetchData('carts')
    // create product data
    const productList = await Product.find().lean()
    // create user data
    const userList =  await User.find({ role: 'user' }).lean()
    let newOrders = []
    for (let i = 0; i < orderData.length; i++) {
      const productIndex = parseInt(Math.random() * productList.length)
      const products = orderData[i].products.map(item => ({
        productId: productList[productIndex]._id,
        quantity: item.quantity
      }))

      const userIndex = i % userList.length
      newOrders.push({
        userId: userList[userIndex]._id,
        date: orderData[i].date,
        products: products
      })
    }
    // insert data
    await Order.create(newOrders)
    console.log('done')
    process.exit()
  } catch (error) {
    console.error(error)
  }
})
