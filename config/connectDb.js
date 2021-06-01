require('dotenv').config();

const mongoose = require('mongoose');

const Dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connected to DataBase');
  } catch (error) {
    console.error(error);
  }
};

module.exports = Dbconnect;
