const passport = require('../config/passport')
const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const adminRouter = require('./modules/admin')
const userRouter = require('./modules/user')

// router.use('/admin', authenticated, authenticatedAdmin, adminRouter)
router.use('/user', authenticated, userRouter)
router.post('/register', userController.signUp)
router.post('/login', passport.authenticate('local', { session: false }), userController.logIn)
router.post('/logout', authenticated, userController.logOut)


module.exports = router