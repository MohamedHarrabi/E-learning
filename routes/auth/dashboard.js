const express = require('express');
const mongoose = require('mongoose');
const isAuth = require('../../middlewares/isAuth');
const router = express.Router();

// Get
// @Route locahost:3000/auth/dashboard
// @desc get auth user
// @access private

router.get('/dashboard', isAuth, async (req, res) => {
  res.status(200).send({ msg: 'welcome to dashboard', user: req.user });
});

module.exports = router;
