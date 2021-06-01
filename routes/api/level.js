const mongoose = require('mongoose');
const express = require('express');
const isAuth = require('../../middlewares/isAuth');
const Level = require('../../models/Level');
const Course = require('../../models/Course');
const Quiz = require('../../models/Quiz');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { validator, levelRules } = require('../../middlewares/validator');

// Get
// @Route localhost:3000/api/levels
// @desc get all levels
// @access private

router.get('/', async (req, res) => {
  try {
    const allLevels = await Level.find();
    if (allLevels.length == 0) {
      return res.json({ msg: 'there is no levels' });
    }
    res.status(200).send({ msg: 'all levels', allLevels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});
// Get
// @Route localhost:3000/api/levels/:id
// @desc get one level by id
// @access private

router.get('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const findLevel = await Level.findById({ _id });

    res.status(200).send({ msg: 'level found by id', findLevel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

// Post
// @Route localhost:3000/api/levels
// @desc add new level
// @access private (teacher)
router.post(
  '/',

  levelRules(),
  validator,

  async (req, res) => {
    // if (req.user.role != 'teacher') {
    //   return res.json({ msg: 'not allowed to add levels' });
    // }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { numLevel, levelName, levelDescription, nbOfCourses } = req.body;
      // check for numlevel
      const checkNumLevel = await Level.findOne({ numLevel });
      if (checkNumLevel) {
        return res.json({ msg: 'the number of the level already exists' });
      }
      // check namelevel
      const checkNameLevel = await Level.findOne({ levelName });
      if (checkNameLevel) {
        return res.json({ msg: 'the name of the level already exists' });
      }
      // create new level

      const newLevel = new Level({
        numLevel,
        levelName,
        levelDescription,
        nbOfCourses,
      });
      await newLevel.save();
      res.status(200).json({ msg: 'level addedd', newLevel });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'server error' });
    }
  }
);

// put
// @Route localhost:3000/api/levels/:id
// @desc edit level
// @access private (teacher)

router.put('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const updatedLevel = { $set: req.body };
    const levell = await Level.findOneAndUpdate({ _id }, { ...updatedLevel });
    const allLevels = await Level.find();
    res.status(200).json({ msg: 'level edited with success', allLevels });
  } catch (error) {
    res.status(500).json({ msg: 'server error' });
  }
});

// delete
// @Route localhost:3000/api/levels/:id
// @desc delete one level by id
// @access private (teacher)

router.delete('/:_id', async (req, res) => {
  // if (req.user.role != 'teacher') {
  //   return res.json({ msg: 'not allowed to delete Level' });
  // }
  try {
    const { _id } = req.params;
    const courseID = await Course.find({ level: _id });

    if (courseID) {
      courseID.map(async (el) => {
        await Quiz.deleteOne({ course: el._id });
      });
    }
    const delCourses = await Course.deleteMany({ level: _id });
    const delLevel = await Level.findOneAndDelete({ _id });

    const allLevels = await Level.find();
    if (allLevels.length == 0) {
      return res.status(200).send({
        msg: 'level deleted(with courses and quizzes),there is no levels',
      });
    }
    res
      .status(200)
      .send({ msg: 'level deleted(with courses and quizzes)', allLevels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

module.exports = router;
