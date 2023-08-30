const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  url: {
    type: String,
    required: false
  },
  metadata: {
    type: String,
    required: false
  }
})

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  image: [ImageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
})
module.exports = mongoose.model('Product', productSchema)