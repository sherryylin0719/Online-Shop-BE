const uploadImage = require('../helpers/file-helper').uploadImage
const productHelper = require('../helpers/product-helper');
const Product = require('../models/product');

const adminController = {
  getProducts: async (req, res, next) => {
    try {
      productHelper.getProducts(req, res, next);
    } catch (err) {
      next(err)
    }
  },
  addNewProduct: async (req, res, next) => {
    try {
      const { title, price, category, description, quantity } = req.body

      // upload image to cloudinary and return image object
      const image = await uploadImage(req, res, next)
      
      // create new product
      const product = await Product.create({
        title,
        price,
        category,
        description,
        quantity,
        image
      })
      res.status(200).json({
        status: 'success',
        message: 'Add product success',
        data: {
          product: product
        }
      });
    } catch (err) {
      next(err)
    }
  },
  editProduct: async (req, res, next) => {
    try {
      // upload image to cloudinary

    } catch (err) {
      next(err)
    }
  },
}

module.exports = adminController;