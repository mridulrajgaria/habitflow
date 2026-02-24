const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  color: {
    type: String,
    default: '#7c6af7',
    match: /^#[0-9A-Fa-f]{6}$/
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'learning', 'mindfulness', 'productivity', 'creative', 'social', 'general'],
    default: 'general'
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
