const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  numLevel: { type: Number, required: true, unique: true },
  levelName: { type: String, required: true, unique: true },
  levelDescription: { type: String, required: true },
  nbOfCourses: { type: Number },
});

module.exports = mongoose.model('Level', levelSchema);
