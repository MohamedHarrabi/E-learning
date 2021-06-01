const mongoose = require('mongoose');
const express = require('express');
const isAuth = require('../../middlewares/isAuth');
const Level = require('../../models/Level');
const Course = require('../../models/Course');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { courseRules, validator } = require('../../middlewares/validator');
const Quiz = require('../../models/Quiz');

// Get
// @Route locahost:3000/api/courses
// @desc get all courses
// @access private

router.get('/', async (req, res) => {
  try {
    const allCourses = await Course.find().populate(
      'level',
      'numLevel levelName -_id'
    );
    // .select('-_id');
    if (allCourses.length == 0) {
      return res.json({ msg: 'there is no courses' });
    }
    res.status(200).send({ msg: 'all courses', allCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

// Get
// @Route locahost:3000/api/courses/level/:id
// @desc get all courses of selected Level
// @access private

router.get('/level/:_id', async (req, res) => {
  const { _id } = req.params;
  try {
    const allCourses = await Course.find({ level: _id });
    // .select('-_id');
    if (allCourses.length == 0) {
      return res.json({ msg: 'there is no courses' });
    }
    res.status(200).send({ msg: 'all courses of this level', allCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

// Get
// @Route localhost:3000/api/courses/:id
// @desc get one course by id
// @access private

router.get('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const findCourse = await Course.findById({ _id });
    res.status(200).send({ msg: 'Course found by id', findCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

// Post
// @Route locahost:3000/api/courses
// @desc add new course
// @access private
router.post(
  '/',

  courseRules(),
  validator,

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        courseTitle,
        courseContent,
        courseDuration,
        level,
        price,
        author,
      } = req.body;
      const checkCourse = await Course.findOne({ courseTitle });
      if (checkCourse) {
        return res.json({ msg: 'the course name already exists' });
      }
      const checkLevel = await Level.findById({ _id: level });
      if (!checkLevel) {
        return res.json({ msg: 'enter a valid level id' });
      }
      const newCourse = new Course({
        courseTitle,
        courseContent,
        courseDuration,
        level,
        price,
        author,
      });
      await newCourse.save();
      res.status(200).json({ msg: 'course addedd', newCourse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'server error' });
    }
  }
);
// put
// @Route localhost:3000/api/courses/:id
// @desc edit course
// @access private (teacher)

router.put('/:_id', async (req, res) => {
  if (req.user.role != 'teacher') {
    return res.json({ msg: 'not allowed to do modification' });
  }
  try {
    const { _id } = req.params;
    const updatedCourse = { $set: req.body };
    const coursetoupdate = await Course.findOneAndUpdate(
      { _id },
      { ...updatedCourse }
    );
    const allCourses = await Course.find();
    res.status(200).json({ msg: 'course edited with success', allCourses });
  } catch (error) {
    res.status(500).json({ msg: 'server error' });
  }
});

// delete
// @Route localhost:3000/api/courses/:id
// @desc delete one course by id
// @access private (teacher)

router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const delQuizz = await Quiz.findOneAndDelete({ course: _id });
    const delCourse = await Course.findOneAndDelete({ _id });
    const allCourses = await Course.find();

    if (allCourses.length == 0) {
      return res.status(200).send({
        msg: 'Course deleted(with quizzes),there is no Courses',
      });
    }
    res.status(200).send({ msg: 'Course deleted(with quizzes)', allCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

module.exports = router;
