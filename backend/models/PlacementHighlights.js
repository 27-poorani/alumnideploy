const mongoose = require('mongoose');

const PlacementHighlightsSchema = new mongoose.Schema({
  totalOffers: { type: Number, required: true },
  highestPackage: { type: String, required: true },
  topRecruiters: { type: Number, required: true },
});

module.exports = mongoose.model('PlacementHighlights', PlacementHighlightsSchema); 