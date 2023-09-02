const express = require('express')
const multerUpload = require('../../helpers/file-helper').multerUpload
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.delete('/users/:id', adminController.deleteUser)
router.get('/users', adminController.getUsers)
router.delete('/products/:id', adminController.deleteProduct)
router.put('/products/:id', multerUpload, adminController.editProduct)
router.get('/products', adminController.getProducts)
router.post('/products', multerUpload, adminController.addNewProduct)

module.exports = router
 