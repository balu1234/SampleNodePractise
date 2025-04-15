const Tag = require('../models/Tag');

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error: error.message });
  }
};

// Get single tag by ID
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tag', error: error.message });
  }
};

// Create new tag
exports.createTag = async (req, res) => {
  try {
    const { name, color } = req.body;

    // Check if tag with same name exists
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag with this name already exists' });
    }

    const newTag = new Tag({
      name,
      color: color || '#000000' // Default color if not provided
    });

    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tag', error: error.message });
  }
};

// Update tag
exports.updateTag = async (req, res) => {
  try {
    const { name, color } = req.body;
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Check if new name conflicts with existing tag
    if (name && name !== tag.name) {
      const existingTag = await Tag.findOne({ name });
      if (existingTag) {
        return res.status(400).json({ message: 'Tag with this name already exists' });
      }
    }

    tag.name = name || tag.name;
    tag.color = color || tag.color;

    const updatedTag = await tag.save();
    res.json(updatedTag);
  } catch (error) {
    res.status(500).json({ message: 'Error updating tag', error: error.message });
  }
};

// Delete tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    await tag.deleteOne();
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tag', error: error.message });
  }
}; 