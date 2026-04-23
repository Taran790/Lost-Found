const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// @route   POST api/items
// @desc    Add new item
// @access  Private
router.post('/', auth, async (req, res) => {
  const { itemName, description, type, location, date, contactInfo } = req.body;

  try {
    const newItem = new Item({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      user: req.user.id,
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/items/search
// @desc    Search items by name
// @access  Private
router.get('/search', auth, async (req, res) => {
  const { name } = req.query;
  try {
    const items = await Item.find({ itemName: { $regex: name, $options: 'i' } }).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/items
// @desc    Get all items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 }).populate('user', ['name', 'email']);
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/items/:id
// @desc    Get item by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/items/:id
// @desc    Update item
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { itemName, description, type, location, date, contactInfo } = req.body;

  // Build item object
  const itemFields = {};
  if (itemName) itemFields.itemName = itemName;
  if (description) itemFields.description = description;
  if (type) itemFields.type = type;
  if (location) itemFields.location = location;
  if (date) itemFields.date = date;
  if (contactInfo) itemFields.contactInfo = contactInfo;

  try {
    let item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: itemFields },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/items/:id
// @desc    Delete item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
