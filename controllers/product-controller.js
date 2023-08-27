const Product = require('../models/product.js')

const productController = {
  getProducts: async (req, res, next) => {
    try {
      const productLists = await Product.find()
      if (productLists.length === 0) {
        res.status(200).json({
          status: 'success',
          message: 'Get products success',
          data: {
            products: []
          }
        });
      } else {
        res.status(200).json({
          status: 'success',
          message: 'Get products success',
          data: {
            products: productLists
          }
        });
      }
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