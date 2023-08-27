if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const encryption = require('mongoose-encryption');
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  cart: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  role: {
    type: String,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})

const encKey = process.env.ENC_SECRET;
const sigKey = process.env.SIG_SECRET;

// Encrypt specified fields
userSchema.plugin(encryption, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['name','address','phone'] });

module.exports = mongoose.model('User', userSchema)