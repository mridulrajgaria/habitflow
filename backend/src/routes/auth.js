const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getMe, updateAvatar, removeAvatar } = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.get('/me', authenticate, getMe);
router.put('/avatar', authenticate, updateAvatar);
router.delete('/avatar', authenticate, removeAvatar);

module.exports = router;
