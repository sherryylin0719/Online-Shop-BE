const express = require('express')
const multerUpload = require('../../helpers/file-helper').multerUpload
const router = express.Router()
const adminController = require('../../controllers/admin-controller')



router.put('/products/:id', multerUpload, adminController.editProduct)
router.get('/products', adminController.getProducts)
router.post('/products', multerUpload, adminController.addNewProduct)

module.exports = router
 