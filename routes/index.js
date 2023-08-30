const passport = require('../config/passport')
const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const productRouter = require('./modules/products')
const adminRouter = require('./modules/admin')
const userRouter = require('./modules/user')
const cartRouter = require('./modules/cart')

router.use('/admin', authenticated, authenticatedAdmin, adminRouter)
router.use('/cart', authenticated, cartRouter)
router.use('/user', authenticated, userRouter)
router.use('/products', productRouter)
router.post('/login', passport.authenticate('local', { session: false }), userController.logIn)
router.post('/order', authenticated, userController.createOrder)
router.post('/logout', authenticated, userController.logOut)
router.post('/register', userController.signUp)


module.exports = router