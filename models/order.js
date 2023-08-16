const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  },
  products: [productSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
})
module.exports = mongoose.model('Order', orderSchema)