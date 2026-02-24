const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Stored as YYYY-MM-DD string to avoid timezone issues
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  note: {
    type: String,
    trim: true,
    maxlength: 300,
    default: ''
  }
}, { timestamps: true });

// Compound unique index: one completion per habit per day
habitCompletionSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitCompletion', habitCompletionSchema);
