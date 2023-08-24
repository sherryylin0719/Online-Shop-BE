if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const encryption = require('mongoose-encryption');
const bcrypt = require("bcryptjs")
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (!this.password) {
      throw new Error('password not set')
    } else {
      const match = await bcrypt.compare(candidatePassword, this.password)
      return match
    }
  } catch (err) {
    console.error('Error comparing passwords:', err);
    return false;
  }
}

// Encrypt specified fields
userSchema.plugin(encryption, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['name','email','password','address','phone'] });

module.exports = mongoose.model('User', userSchema)