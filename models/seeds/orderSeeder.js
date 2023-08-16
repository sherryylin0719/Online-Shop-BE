const db = require('../../config/mongoose')
const fetchData = require('./apiService')
const Product = require('../product')
const Order = require('../order')
const User = require('../user')

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
