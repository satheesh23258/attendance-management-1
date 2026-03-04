const express = require('express');
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');
const router = express.Router();

// Get all tasks for user
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Create task
router.post('/', protect, async (req, res) => {
  try {
    const { actionName } = req.body;
    if (!actionName) return res.status(400).json({ success: false, error: 'Action Name missing' });
    const task = await Task.create({
      userName: req.user.name,
      actionName,
      owner: req.user._id
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Update task
router.put('/:id', protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Not Found' });
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not Authorized' });
    }
    task = await Task.findByIdAndUpdate(req.params.id, { actionName: req.body.actionName }, { new: true, runValidators: true });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// Delete task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Not Found' });
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not Authorized' });
    }
    await task.deleteOne();
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
