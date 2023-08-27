const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [productSchema],
})
module.exports = mongoose.model('Cart', cartSchema)