const passport = require('../config/passport')
const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')

router.post('/login', passport.authenticate('local', { session: false }), userController.login)


module.exports = router