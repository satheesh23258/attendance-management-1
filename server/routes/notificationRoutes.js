import express from 'express';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET all relevant notifications for the current user
router.get('/', auth, async (req, res) => {
  try {
    const { unreadOnly, limit, type } = req.query;
    
    // User can see general notifications for all, for their role, or specifically for them
    const filter = {
      $or: [
        { userId: req.user._id },
        { targetRole: req.user.role },
        { targetRole: 'all' }
      ]
    };

    if (unreadOnly === 'true') filter.isRead = false;
    if (type) filter.type = type;

    let query = Notification.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));
    const notifications = await query.exec();
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET unread count for current user
router.get('/unread-count', auth, async (req, res) => {
  try {
    const filter = {
      isRead: false,
      $or: [
        { userId: req.user._id },
        { targetRole: req.user.role },
        { targetRole: 'all' }
      ]
    };
    const count = await Notification.countDocuments(filter);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH mark as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, $or: [{ userId: req.user._id }, { targetRole: req.user.role }, { targetRole: 'all' }] },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found or access denied' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH mark all as read for current user
router.patch('/read-all', auth, async (req, res) => {
  try {
    const filter = {
      isRead: false,
      $or: [
        { userId: req.user._id },
        { targetRole: req.user.role },
        { targetRole: 'all' }
      ]
    };
    await Notification.updateMany(filter, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    
    // Allow if strictly theirs or if they are admin viewing it
    if (notification.userId && notification.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden to delete this notification' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
