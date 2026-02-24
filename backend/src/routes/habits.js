const express = require('express');
const { body } = require('express-validator');
const { getHabits, createHabit, updateHabit, deleteHabit, archiveHabit, getHabitById } = require('../controllers/habits');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

const habitValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Invalid color format'),
  body('category').optional().isIn(['health', 'fitness', 'learning', 'mindfulness', 'productivity', 'creative', 'social', 'general'])
];

router.get('/', getHabits);
router.post('/', habitValidation, createHabit);
router.put('/:id', habitValidation, updateHabit);
router.delete('/:id', deleteHabit);
router.patch('/:id/archive', authenticate, archiveHabit);

module.exports = router;