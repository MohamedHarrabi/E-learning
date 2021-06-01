const mongoose = require('mongoose');
const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isAuth = require('../../middlewares/isAuth');
const {
  registerRules,
  validator,
  loginRules,
} = require('../../middlewares/validator');

// Post
// @Route locahost:3000/api/users/register
// @desc user register
// @access public

router.post(
  '/register',
  registerRules(),
  validator,

  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        adress,
        registrationDate,
        role,
      } = req.body;

      // see if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] });
      }

      // get user Gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      //return jwt

      // create new User
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        adress,
        registrationDate,
        role,
        avatar,
      });

      // encrypt password
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      newUser.password = hashedPassword;

      // save New user
      await newUser.save();

      // jwt
      const payload = {
        id: newUser._id,
        name: newUser.lastName,
      };
      const token = await jwt.sign(payload, process.env.secretOrKey, {
        expiresIn: '2 days',
      });

      res.status(200).send({ msg: 'user addedd', newUser, token });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);
// Post
// @Route locahost:3000/api/users/login
// @desc user login
// @access public

router.post(
  '/login',
  loginRules(),
  validator,

  async (req, res) => {
    try {
      const { email, password } = req.body;

      // see if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Bad Credentials!' }] });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ errors: [{ msg: 'Bad Credentials!' }] });
      }

      // jwt
      const payload = {
        id: user._id,
        name: user.lastName,
      };
      const token = await jwt.sign(payload, process.env.secretOrKey, {
        expiresIn: '2 days',
      });

      res.status(200).send({ msg: 'logged in with success', user, token });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);

// Get
// @Route locahost:3000/api/users
// @desc get all users
// @access public
router.get('/', async (req, res) => {
  try {
    const userslist = await User.find();
    res.status(200).send({ msg: 'all users', userslist });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errors: error });
  }
});

// Get
// @Route locahost:3000/api/users
// @desc get one user by id
// @access public
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.status(200).send({ msg: 'user found by id ', user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ errors: error });
//   }
// });
//@route GET locahost:3000/api/users/user
//@desc Get authentified user
//@access Private
router.get('/user', isAuth, (req, res) => {
  res.status(200).send({ user: req.user });
});

router.put('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedUser = { $set: req.body };
    const user = await User.findOneAndUpdate({ _id }, { ...updatedUser });
    const useraftermodif = await User.find({ _id });
    res.status(200).json({ msg: 'user modified', useraftermodif });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errors: error });
  }
});

module.exports = router;
