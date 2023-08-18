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

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  products: [productSchema],
})
module.exports = mongoose.model('Cart', cartSchema)