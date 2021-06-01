const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true, unique: true },
  courseContent: { type: String, required: true },
  courseDuration: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  level: {
    type: mongoose.Types.ObjectId,
    ref: 'Level',
  },
  author: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Course', courseSchema);
