const express = require('express');
const PlacementHighlights = require('../models/PlacementHighlights');
const auth = require('../middleware/auth');

const router = express.Router();

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  next();
}

// GET placement highlights (public)
router.get('/', async (req, res) => {
  try {
    let highlights = await PlacementHighlights.findOne();
    if (!highlights) {
      // Default values if not set
      highlights = new PlacementHighlights({ totalOffers: 0, highestPackage: '0 LPA', topRecruiters: 0 });
      await highlights.save();
    }
    res.json(highlights);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE placement highlights (admin only, upsert)
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const { totalOffers, highestPackage, topRecruiters } = req.body;
    let highlights = await PlacementHighlights.findOne();
    if (!highlights) {
      highlights = new PlacementHighlights({ totalOffers, highestPackage, topRecruiters });
    } else {
      highlights.totalOffers = totalOffers;
      highlights.highestPackage = highestPackage;
      highlights.topRecruiters = topRecruiters;
    }
    await highlights.save();
    res.json(highlights);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 