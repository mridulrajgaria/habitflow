const express = require('express');
const { getDashboardStats } = require('../controllers/stats');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.get('/dashboard', getDashboardStats);

module.exports = router;
