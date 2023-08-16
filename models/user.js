const mongoose = require('mongoose')
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
  createdAt: {
    type: Date,
    default: Date.now
  },
})
module.exports = mongoose.model('User', userSchema)