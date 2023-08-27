const User = require('../models/user.js');

const cartController = {
  getCart: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id)
      if (!user) return res.status(404).json({ msg: "User does not exist." })

      await user.populate('carts').execPopulate();
      const cart = user.carts;
      res.status(200).json({
        status: 'success',
        message: 'Get cart success',
        data: {
          cart: cart
        }
      });
    } catch (err) {
      next(err)
    }
  },
  addToCart: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body
      const userId = req.user._id

      const user = await User.findById(userId);

      // Try to find the existing product in user's cart
      const existingProduct = user.cart.find(product => product.productId.equals(productId));

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        user.cart.push({
          productId,
          quantity
        });
      }

      await user.save();
      
      res.status(200).json({
        status: 'success',
        message: 'Add to cart success',
        data: {
          cart: user.cart
        }
      });
    } catch (err) {
      next(err)
    }
  },
  deleteCart: async (req, res, next) => {
    try {
      const userId = req.user._id
      const user = await User.findById(userId);
      const productId = req.params.productId
      const productIndex = user.cart.findIndex(product => product.productId.equals(productId));
      if (productIndex === -1) {
        return res.status(404).json({ msg: "Product does not exist." });
      }

      // Remove product from cart
      user.cart.splice(productIndex, 1);
      await user.save();

      res.status(200).json({
        status: 'success',
        message: 'Delete cart success',
        data: {
          cart: user.cart
        }
      });

    } catch (err) {
      next(err)
    }
  }
}

module.exports = cartController