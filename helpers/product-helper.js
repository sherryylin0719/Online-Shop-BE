const Product = require('../models/product.js')

const getProducts = async (req, res, next) => {
    try {
      const productList = await Product.find()
      const response = {
        status: 'success',
        message: 'Get products success',
        data: {
          products: productList
        }
      };
      if (productList.length === 0) {
        response.data.products = []; 
      }
      res.status(200).json(response);
    } catch (err) {
      next(err)
    }
  }

module.exports = {
    getProducts
}