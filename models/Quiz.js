const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quiztitle: { type: String, required: true, unique: true },
  quizContent: { type: String, required: true },
  quizNote: { type: String, required: true },
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
