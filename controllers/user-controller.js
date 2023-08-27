const { isValidPassword, isValidEmail } = require ('../helpers/validation-helpers.js')
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

      // create new user
      await User.create({ 
        name,
        email,
        password,
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
  }

}

module.exports = userController