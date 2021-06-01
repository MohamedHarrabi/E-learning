const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  adress: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  role: { type: String, required: true },
  avatar: { type: String },
});

module.exports = mongoose.model('user', userSchema);
