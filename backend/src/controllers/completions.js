const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

const toggleCompletion = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { date, note } = req.body;
    const completionDate = date || new Date().toISOString().split('T')[0];

    // Verify habit belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id, archivedAt: null });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    // Check existing completion
    const existing = await HabitCompletion.findOne({ habitId, date: completionDate });

    if (existing) {
      // Toggle off
      await HabitCompletion.deleteOne({ _id: existing._id });
      return res.json({ completed: false, date: completionDate, message: 'Habit unmarked' });
    }

    // Toggle on
    const completion = await HabitCompletion.create({
      habitId,
      userId: req.user._id,
      date: completionDate,
      note: note ? note.trim() : ''
    });

    res.status(201).json({ completed: true, completion, message: 'Habit marked complete!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Already completed for this date' });
    }
    console.error('Toggle completion error:', error);
    res.status(500).json({ error: 'Failed to toggle completion' });
  }
};

const getCompletions = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { from, to } = req.query;

    // Verify ownership
    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const query = { habitId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }

    const completions = await HabitCompletion.find(query).sort({ date: -1 });
    res.json({ completions });
  } catch (error) {
    console.error('Get completions error:', error);
    res.status(500).json({ error: 'Failed to fetch completions' });
  }
};

module.exports = { toggleCompletion, getCompletions };
