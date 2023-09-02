const { isValidPassword, isValidEmail } = require ('../helpers/validation-helpers.js')
const hashedPassword = require('../helpers/general-helper.js').hashedPassword
const Order = require('../models/order')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const userController = {
  logIn: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData,
        }
      })
    } catch (err) {
      next(err)
    }
  },
  logOut: async (req, res, next) => { 
    try {
      req.logout()
      res.json({
        status: 'success',
        message: 'logout success'
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck, birthday, gender, address, phone } = req.body

      // validation
      if(!name || !email || !password || !passwordCheck) {
        return res.status(400).json({ msg: "Not all fields have been entered." })
      }
      if(password !== passwordCheck) {
        return res.status(400).json({ msg: "Enter the same password twice for verification." })
      }
      if(password.length < 8 || password.length > 20) {
        return res.status(400).json({ msg: "The password needs to be between 8 to 20 characters long." })
      }
      if(!isValidPassword(password)) {
        return res.status(400).json({ msg: "The password must contain at least one uppercase letter, one lowercase letter, one number and a special character." })
      }
      if(!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid email address." })
      }

      // check if email already exists
      const existingUser = await User.findOne({ email })
      if(existingUser) {  
        return res.status(400).json({ msg: "An account with this email already exists." })
      }

      // hash password
      const hash = await hashedPassword(password)

      // create new user
      await User.create({ 
        name,
        email,
        password: hash,
        birthday: birthday || null,
        gender: gender || null,
        address: address || null,
        phone: phone || null
      })
      
      res.status(201).json({
        status: 'success',
        message: 'sign up success'
      })
    } catch (err) { 
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id)
      if (!user) return res.status(400).json({ msg: "User does not exist." })
      
      const userData = user.toJSON()
      delete userData.password;

      res.status(200).json({
        status: 'success',
        data: {
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      // find user
      const user = await User.findById(req.user._id)
      if (!user) return res.status(400).json({ msg: "User does not exist." })

      // request body
      const { name, email, password, passwordCheck, birthday, gender, address, phone } = req.body

      // check if email already exists
      if(email){
        const checkEmail = await User.findOne({ email })
        if (checkEmail && checkEmail._id.toString() !== user._id.toString()) {
          return res.status(400).json({ msg: "An account with this email already exists." })
        }
        if(!isValidEmail(email)) {
        return res.status(400).json({ msg: "Invalid email address." })
        }
      }

      // validation
      if(password !== passwordCheck) {
        return res.status(400).json({ msg: "Enter the same password twice for verification." })
      }

      // update user
      if (name) user.name = name;
      if (email) user.email = email;
      if (birthday) user.birthday = birthday;
      if (gender) user.gender = gender;
      if (address) user.address = address;
      if (phone) user.phone = phone;

      await user.save()
      const userData = user.toObject()
      delete userData.password;

      res.status(200).json({
        status: 'success',
        message: 'edit user success',
        data: {
          user: userData
        }
      })

    } catch (err) {
      next(err)
    }
  },
  getUserOrders: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id)
      if (!user) return res.status(400).json({ msg: "User does not exist." })

      const orders = await user.populate('orders').execPopulate()
      res.status(200).json({
        status: 'success',
        data: {
          orders: orders.orders
        }
      })
    } catch (err) {
      next(err)
    }
  },
  createOrder: async (req, res, next) => {
    try {
      // create order in order collection
      const { products, totalAmount, shippingAddress, paymentMethod } = req.body
      const userId = req.user._id
      const order = await Order.create({
        products,
        totalAmount,
        shippingAddress,
        paymentMethod,
        userId
      })

      // add order to user order array
      const orderId = order._id
      await User.findByIdAndUpdate(userId, { $push: { orders: orderId } })

      res.status(201).json({
        status: 'success',
        message: 'create order success',
        data: {
          order
        }
      })
      
    } catch (err) {
      next(err)
    } 
  }
}
module.exports = userController