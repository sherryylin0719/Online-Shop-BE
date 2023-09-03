const { uploadImage, updateImage, deleteImage } = require('../helpers/file-helper');
const productHelper = require('../helpers/product-helper');
const Product = require('../models/product');
const Order = require('../models/order');
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
      const imageDeleted = await deleteImage(req, res, next)
      // delete product
      const product = await Product.findByIdAndDelete(productId)
      
      if (imageDeleted && product) {
        res.status(200).json({
          status: 'success',
          message: 'Delete product success',
          data: {
            product: product
          }
        });
      } else {
        res.status(500).json({
          status: 'fail',
          message: 'Delete product failed'
        });
      }
      
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
  getOrders: async (req, res, next) => {
    try {
      const orders = await Order.find().populate({  
        path: 'products',
        populate: {
          path: 'productId'
        }
      }).populate({ path: 'userId', select: '-password', select: '-cart' })

      const response = {
        status: 'success',
        message: 'Get orders success',
        data: {
          orders: orders
        }
      };
      if (orders.length === 0) {
        response.data.orders = []; 
      }
      res.status(200).json(response);

    } catch (err) {
      next(err)
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      const orderId = req.params.id
      const order = await Order.find({ _id: orderId }).populate({
        path: 'userId',
        select: '-password',
      })
      const userId = order[0].userId._id
      console.log(userId)
      // delete order from user
      await Order.findByIdAndDelete(orderId)
      // delete order from user
      await User.updateOne({ _id: userId }, { $pull: { orders: orderId } });

      res.status(200).json({
        status: 'success',
        message: 'Delete order success',
      });
      
    } catch (err) {
      next(err)
    }
  },

}

module.exports = adminController;