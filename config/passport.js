const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

// set up passport strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => { 
  try {
    // check if email exist
    const user = await User.findOne({ email })
    if (!user) {
      return cb(null, false, { status: 401, message: 'That email is not registered!' })
    }
    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return cb(null, false, { status: 401, message: 'Email or Password incorrect!' })
    }
    // return user if pass
    return cb(null, user)
  } catch (err) {
    console.error('Error:', err);
    return cb(err)
  }
}))

// set up passport jwt strategy
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    if (!user) return cb(null, false)
    return cb(null, user)
  } catch (err) {
    return cb(err)
  }
}
))

module.exports = passport


