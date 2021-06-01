const mongoose = require('mongoose');
const express = require('express');
const isAuth = require('../../middlewares/isAuth');
const Level = require('../../models/Level');
const Course = require('../../models/Course');
const Quiz = require('../../models/Quiz');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { quizRules, validator } = require('../../middlewares/validator');

// Get
// @Route locahost:3000/api/quiz
// @desc get all quizs
// @access private

router.get('/', async (req, res) => {
  try {
    const allquiz = await Quiz.find().populate('course');
    //.select('-_id');
    if (allquiz.length == 0) {
      return res.json({ msg: 'there is no quizzes' });
    }
    res.status(200).send({ msg: 'all quizs', allquiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

// Get
// @Route localhost:3000/api/quiz/:id
// @desc get one quiz by id
// @access private

router.get('/:_id', isAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const findQuiz = await Quiz.findById({ _id });
    res.status(200).send({ msg: 'Quiz found by id', findQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

// Post
// @Route locahost:3000/api/quiz
// @desc add new quiz
// @access private
router.post('/', isAuth, quizRules(), validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { quiztitle, quizContent, quizNote, course } = req.body;
    const checkQuizTitle = await Quiz.findOne({ quiztitle });
    if (checkQuizTitle) {
      return res.json({ msg: 'the quiz title already exists' });
    }
    const cheqQuiz = await Course.findById({ _id: course });
    if (!cheqQuiz) {
      return res.json({ msg: 'enter a valid course id' });
    }
    const checkExistCourse = await Quiz.findOne({ course: course });

    if (checkExistCourse) {
      return res.json({ msg: 'this course already have a quiz' });
    }
    const newQuiz = new Quiz({
      quiztitle,
      quizContent,
      quizNote,
      course,
    });
    await newQuiz.save();
    res.status(200).json({ msg: 'Quiz addedd', newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

// put
// @Route localhost:3000/api/quiz/:id
// @desc edit quiz
// @access private (teacher)

router.put('/:_id', isAuth, async (req, res) => {
  if (req.user.role != 'teacher') {
    return res.json({ msg: 'not allowed to do modification' });
  }
  try {
    const { _id } = req.params;
    const updatedQuiz = { $set: req.body };
    const quizToUpdate = await Quiz.findOneAndUpdate(
      { _id },
      { ...updatedQuiz }
    );
    const allQuizs = await Quiz.find();
    res.status(200).json({ msg: 'Quiz edited with success', allQuizs });
  } catch (error) {
    res.status(500).json({ msg: 'server error' });
  }
});

// delete
// @Route localhost:3000/api/quiz/:id
// @desc delete one quiz by id
// @access private (teacher)

router.delete('/:_id', isAuth, async (req, res) => {
  if (req.user.role != 'teacher') {
    return res.json({ msg: 'not allowed to delete Quiz' });
  }
  try {
    const { _id } = req.params;
    const delQuizz = await Quiz.findOneAndDelete({ _id });
    const allQuizs = await Quiz.find();

    if (allQuizs.length == 0) {
      return res.status(200).send({
        msg: 'Quiz deleted,there is no Quizs',
      });
    }
    res.status(200).send({ msg: 'Quiz deleted', allQuizs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'server error' });
  }
});

module.exports = router;
