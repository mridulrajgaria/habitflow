const express = require('express');
const { toggleCompletion, getCompletions } = require('../controllers/completions');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/:habitId/toggle', toggleCompletion);
router.get('/:habitId', getCompletions);

module.exports = router;
