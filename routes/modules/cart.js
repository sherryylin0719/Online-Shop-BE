const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart-controller.js')

router.delete('/:productId', cartController.deleteCart)
router.get('/', cartController.getCart)
router.post('/', cartController.addToCart)

module.exports = router