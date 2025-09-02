const Cart = require("../models/cart");
const Product = require("../models/product");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      // Create empty cart if not exists
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    res.json({
      success: true,
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add item to cart or update quantity
exports.addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id, name, image, price, category, quantity } = req.body;
    
    // Validate product exists
    const product = await Product.findOne({ id: parseInt(id) });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }
    
    let cart = await Cart.findOne({ userId });
    
    // Create cart if not exists
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        id: id,
        productId: product._id,
        name: name,
        image: image,
        price: price,
        category: category,
        quantity: quantity
      });
    }
    
    await cart.save();
    
    res.json({
      success: true,
      message: "Item added to cart",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be at least 1"
      });
    }
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }
    
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Item not found in cart"
      });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.json({
      success: true,
      message: "Cart item updated",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }
    
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Item not found in cart"
      });
    }
    
    // Remove item from array
    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    res.json({
      success: true,
      message: "Item removed from cart",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found"
      });
    }
    
    // Clear all items
    cart.items = [];
    await cart.save();
    
    res.json({
      success: true,
      message: "Cart cleared",
      cart: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};