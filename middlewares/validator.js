const { body, validationResult } = require('express-validator');

const registerRules = () => [
  body('firstName', 'first name is required').notEmpty(),
  body('lastName', 'last name is required').notEmpty(),
  body('email', 'please enter a valid email').isEmail(),
  body('password', 'passwrod must have 6 or more characters').isLength({
    min: 6,
  }),
  body('phone', 'please enter a valid phone number').isNumeric(),
  body('adress', 'adress is required').notEmpty(),
  body('role', 'please choose your role').notEmpty(),
];

const loginRules = () => [
  body('email', 'please enter a valid email').isEmail(),
  body('password', 'please enter a correct password').notEmpty(),
];

const levelRules = () => [
  body('numLevel', 'please enter a number for the level').notEmpty(),
  body('levelName', 'please enter a name for the level').notEmpty(),
  body(
    'levelDescription',
    'please enter a description for the level'
  ).notEmpty(),
];

const courseRules = () => [
  body('courseTitle', 'please enter a valid tltle for the course').notEmpty(),
  body('courseContent', 'please enter the course content').notEmpty(),
  body('courseDuration', 'please enter the course duration').notEmpty(),
  body('level', 'please enter the level of the course').notEmpty(),
];

const quizRules = () => [
  body('quiztitle', 'please enter a valid tltle for the quiz').notEmpty(),
  body('quizContent', 'please enter the quiz content').notEmpty(),
  body('quizNote', 'please enter the quiz note').notEmpty(),
  body('course', 'please enter a course').notEmpty(),
];

const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array().map((el) => ({
        msg: el.msg,
      })),
    });
  }
  next();
};

module.exports = {
  validator,
  registerRules,
  loginRules,
  levelRules,
  courseRules,
  quizRules,
};
