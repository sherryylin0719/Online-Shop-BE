const Product = require('../models/product.js')
const productHelper = require('../helpers/product-helper');

const productController = {
  getProducts: async (req, res, next) => {
    try {
      productHelper.getProducts(req, res, next);
    } catch (err) {
      next(err)
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id)
      if (!product) return res.status(404).json({ msg: "Product does not exist." })

      res.status(200).json({
        status: 'success',
        message: 'Get product success',
        data: {
          product: product
        }
      });
    } catch (err) {
      next(err)
    }
  }
}

module.exports = productController