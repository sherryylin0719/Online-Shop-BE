const { uploadImage, updateImage, deleteImage } = require('../helpers/file-helper');
const productHelper = require('../helpers/product-helper');
const Product = require('../models/product');
const User = require('../models/user');

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
      const { title, price, category, description, quantity } = req.body
      // get product id
      const productId = req.params.id

      // check if required fields are not empty
      if (!title || !price || !category || !quantity) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please fill all required fields'
        })
      }
      // update image on cloudinary and return image object
      const image = await updateImage(req, res, next)

      // update product
      const product = await Product.findByIdAndUpdate(productId, {
        title,
        price,
        category,
        description,
        quantity,
        image
      }, { new: true })

      res.status(200).json({
        status: 'success',
        message: 'Edit product success',
        data: {
          product: product
        }
      });

    } catch (err) {
      next(err)
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const productId = req.params.id
      // delete image on cloudinary
      await deleteImage(req, res, next)
      // delete product
      const product = await Product.findByIdAndDelete(productId)

      res.status(200).json({
        status: 'success',
        message: 'Delete product success',
        data: {
          product: product
        }
      });
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find({ role: 'user' }).populate({
        path: 'orders',
      }).select('-password');
      const response = {
        status: 'success',
        message: 'Get users success',
        data: {
          users: users
        }
      };
      if (users.length === 0) {
        response.data.users = []; 
      }
      res.status(200).json(response);

    } catch (err) {
      next(err)
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      // delete user
      await User.findByIdAndDelete(userId)

      res.status(200).json({
        status: 'success',
        message: 'Delete user success',
      });
    } catch (err) {
      next(err)
    }
  },
}

module.exports = adminController;