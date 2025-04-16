const Product = require('../models/Product');
const Category = require('../models/Category');
const Tag = require('../models/Tag');

// Get all products for the authenticated user with relationships
exports.getAllData = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id })
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedProducts', 'title description image')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get single product by ID with relationships
exports.getDataById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, user: req.user.id })
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedProducts', 'title description image');

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create new product with relationships
exports.createData = async (req, res) => {
  try {
    const { title, description, image, category, tags, relatedProducts } = req.body;
    
    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Validate tags if provided
    if (tags && tags.length > 0) {
      const validTags = await Tag.find({ _id: { $in: tags } });
      if (validTags.length !== tags.length) {
        return res.status(400).json({ message: 'One or more tags are invalid' });
      }
    }

    // Validate related products if provided
    if (relatedProducts && relatedProducts.length > 0) {
      const validRelatedProducts = await Product.find({ 
        _id: { $in: relatedProducts },
        user: req.user.id 
      });
      if (validRelatedProducts.length !== relatedProducts.length) {
        return res.status(400).json({ message: 'One or more related products are invalid or unauthorized' });
      }
    }

    const newProduct = new Product({
      title,
      description,
      image,
      user: req.user.id,
      category,
      tags,
      relatedProducts
    });

    const savedProduct = await newProduct.save();
    
    // Populate relationships before sending response
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedProducts', 'title description image');

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product with relationships
exports.updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, category, tags, relatedProducts } = req.body;

    // Find product and check ownership
    const product = await Product.findOne({ _id: id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Validate tags if provided
    if (tags && tags.length > 0) {
      const validTags = await Tag.find({ _id: { $in: tags } });
      if (validTags.length !== tags.length) {
        return res.status(400).json({ message: 'One or more tags are invalid' });
      }
    }

    // Validate related products if provided
    if (relatedProducts && relatedProducts.length > 0) {
      const validRelatedProducts = await Product.find({ 
        _id: { $in: relatedProducts },
        user: req.user.id 
      });
      if (validRelatedProducts.length !== relatedProducts.length) {
        return res.status(400).json({ message: 'One or more related products are invalid or unauthorized' });
      }
    }

    // Update product
    product.title = title || product.title;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.tags = tags || product.tags;
    product.relatedProducts = relatedProducts || product.relatedProducts;
    product.updatedAt = Date.now();

    const updatedProduct = await product.save();
    
    // Populate relationships before sending response
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedProducts', 'title description image');

    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Patch product (only if owned by the authenticated user)
exports.patchData = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find product and check ownership
    const product = await Product.findOne({ _id: id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    // Apply updates
    Object.keys(updates).forEach(update => {
      product[update] = updates[update];
    });
    product.updatedAt = Date.now();

    const updatedProduct = await product.save();
    
    // Populate relationships before sending response
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedProducts', 'title description image');

    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error patching product', error: error.message });
  }
};

// Delete product (only if owned by the authenticated user)
exports.deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product and check ownership
    const product = await Product.findOne({ _id: id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
