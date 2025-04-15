const Data = require('../models/Data');
const Category = require('../models/Category');
const Tag = require('../models/Tag');

// Get all data for the authenticated user with relationships
exports.getAllData = async (req, res) => {
  try {
    const data = await Data.find({ user: req.user.id })
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedData', 'title description')
      .sort({ createdAt: -1 });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

// Get single data by ID with relationships
exports.getDataById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Data.findOne({ _id: id, user: req.user.id })
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedData', 'title description');

    if (!data) {
      return res.status(404).json({ message: 'Data not found or unauthorized' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

// Create new data with relationships
exports.createData = async (req, res) => {
  try {
    const { title, description, category, tags, relatedData } = req.body;
    
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

    // Validate related data if provided
    if (relatedData && relatedData.length > 0) {
      const validRelatedData = await Data.find({ 
        _id: { $in: relatedData },
        user: req.user.id 
      });
      if (validRelatedData.length !== relatedData.length) {
        return res.status(400).json({ message: 'One or more related data items are invalid or unauthorized' });
      }
    }

    const newData = new Data({
      title,
      description,
      user: req.user.id,
      category,
      tags,
      relatedData
    });

    const savedData = await newData.save();
    
    // Populate relationships before sending response
    const populatedData = await Data.findById(savedData._id)
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedData', 'title description');

    res.status(201).json(populatedData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating data', error: error.message });
  }
};

// Update data with relationships
exports.updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, relatedData } = req.body;

    // Find data and check ownership
    const data = await Data.findOne({ _id: id, user: req.user.id });
    if (!data) {
      return res.status(404).json({ message: 'Data not found or unauthorized' });
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

    // Validate related data if provided
    if (relatedData && relatedData.length > 0) {
      const validRelatedData = await Data.find({ 
        _id: { $in: relatedData },
        user: req.user.id 
      });
      if (validRelatedData.length !== relatedData.length) {
        return res.status(400).json({ message: 'One or more related data items are invalid or unauthorized' });
      }
    }

    // Update data
    data.title = title || data.title;
    data.description = description || data.description;
    data.category = category || data.category;
    data.tags = tags || data.tags;
    data.relatedData = relatedData || data.relatedData;
    data.updatedAt = Date.now();

    const updatedData = await data.save();
    
    // Populate relationships before sending response
    const populatedData = await Data.findById(updatedData._id)
      .populate('user', 'username email')
      .populate('category', 'name description')
      .populate('tags', 'name color')
      .populate('relatedData', 'title description');

    res.json(populatedData);
  } catch (error) {
    res.status(500).json({ message: 'Error updating data', error: error.message });
  }
};

// Patch data (only if owned by the authenticated user)
exports.patchData = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find data and check ownership
    const data = await Data.findOne({ _id: id, user: req.user.id });
    if (!data) {
      return res.status(404).json({ message: 'Data not found or unauthorized' });
    }

    // Apply updates
    Object.keys(updates).forEach(update => {
      data[update] = updates[update];
    });
    data.updatedAt = Date.now();

    const updatedData = await data.save();
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Error patching data', error: error.message });
  }
};

// Delete data (only if owned by the authenticated user)
exports.deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    // Find data and check ownership
    const data = await Data.findOne({ _id: id, user: req.user.id });
    if (!data) {
      return res.status(404).json({ message: 'Data not found or unauthorized' });
    }

    await data.deleteOne();
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error: error.message });
  }
};
