if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const productHelper = require('../helpers/product-helper');
const Product = require('../models/product');
const cloudinary = require('cloudinary').v2;
const dataUri = require('../helpers/file-helper').dataUri

// set up cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

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

      // upload image to cloudinary
      const imageUrls = [];
      for (let i = 0; i < req.files.length; i++) {
        try {
          const file = dataUri(req.files[i]).content;
          const result = await cloudinary.uploader.upload(file, {
          public_id: "products",
          resource_type: "auto",
          secure: true,
          });
          imageUrls.push(result.secure_url);
        } catch (err) {
          next(err)
        }
      }
      // create image object
      const image = []
      for (let i = 0; i < imageUrls.length; i++) {
        image.push({
          url: imageUrls[i],
          metadata: title
        })
      }

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
}

module.exports = adminController;