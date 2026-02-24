const { validationResult } = require('express-validator');
const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

const getHabits = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const habits = await Habit.find({ userId: req.user._id, archivedAt: null }).sort({ createdAt: 1 });

    // Get today's completions for all this user's habits
    const habitIds = habits.map(h => h._id);
    const todayCompletions = await HabitCompletion.find({
      userId: req.user._id,
      habitId: { $in: habitIds },
      date: today
    }).select('habitId note');

    const completionMap = {};
    todayCompletions.forEach(c => {
      completionMap[c.habitId.toString()] = c.note || '';
    });

    const habitsWithStatus = habits.map(h => ({
      ...h.toObject(),
      completedToday: h._id.toString() in completionMap,
      todayNote: completionMap[h._id.toString()] || ''
    }));

    res.json({ habits: habitsWithStatus });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

const createHabit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, color, category } = req.body;
    const habit = await Habit.create({
      title,
      description: description || '',
      color: color || '#7c6af7',
      category: category || 'general',
      userId: req.user._id
    });
    res.status(201).json({ habit });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

const updateHabit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, description, color, category } = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, description, color, category },
      { new: true, runValidators: true }
    );

    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json({ habit });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    // Cascade delete all completions
    await HabitCompletion.deleteMany({ habitId: id });

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
};

const getHabitById = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOne({ _id: id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const completions = await HabitCompletion.find({ habitId: id })
      .sort({ date: -1 })
      .limit(90);

    res.json({ habit, completions });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ error: 'Failed to fetch habit' });
  }
};


const archiveHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    habit.archivedAt = habit.archivedAt ? null : new Date(); // toggle
    await habit.save();
    res.json({ habit, archived: !!habit.archivedAt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive habit' });
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit, archiveHabit };
