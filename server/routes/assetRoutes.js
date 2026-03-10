import express from 'express';
import Asset from '../models/Asset.js';
import { auth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../utils/auditLogger.js';

const router = express.Router();

// 📦 Get all assets
router.get('/all', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { status, category } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const assets = await Asset.find(query).populate('assignedTo', 'name email').sort({ name: 1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📦 Get my assigned assets
router.get('/my', auth, async (req, res) => {
  try {
    // Note: Depends on if user object has employeeId or if we lookup by email
    const assets = await Asset.find({ assignedToEmail: req.user.email }).sort({ assignedDate: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📦 Add new asset
router.post('/add', auth, requireRole('admin'), async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    
    await logAudit(req, 'ASSET_CREATED', 'Inventory', { assetName: asset.name, sn: asset.serialNumber });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📦 Update/Assign asset
router.patch('/:id', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    await logAudit(req, 'ASSET_UPDATED', 'Inventory', { 
        asset: asset.name, 
        newStatus: asset.status,
        assignedTo: req.body.assignedTo ? 'Changed' : 'No change'
    });

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
