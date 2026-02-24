const Habit = require('../models/Habit');
const HabitCompletion = require('../models/HabitCompletion');

// Get last N days as YYYY-MM-DD strings
const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const calculateStreak = (dateSet) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (!dateSet.has(today) && !dateSet.has(yesterday)) return 0;

  let streak = 0;
  let checkDate = dateSet.has(today) ? new Date() : new Date(Date.now() - 86400000);

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      streak++;
      checkDate = new Date(checkDate - 86400000);
    } else {
      break;
    }
  }
  return streak;
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const last30Days = getLastNDays(30);
    const last7Days = getLastNDays(7);
    const today = last30Days[last30Days.length - 1];

    // Get all active habits
    const habits = await Habit.find({ userId, archivedAt: null }).sort({ createdAt: 1 });
    const totalHabits = habits.length;

    if (totalHabits === 0) {
      return res.json({
        overview: { totalHabits: 0, completedToday: 0, bestStreak: 0, overallRate: 0 },
        habitStats: [],
        weeklyData: last7Days.map(date => ({
          date,
          label: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
          completed: 0, total: 0, percentage: 0
        })),
        monthlyData: last30Days.map(date => ({ date, completed: 0, total: 0 }))
      });
    }

    const habitIds = habits.map(h => h._id);

    // Get all completions in last 30 days
    const completions = await HabitCompletion.find({
      userId,
      habitId: { $in: habitIds },
      date: { $gte: last30Days[0] }
    }).select('habitId date');

    // Build lookup: habitId -> Set of dates
    const completionMap = {};
    habits.forEach(h => { completionMap[h._id.toString()] = new Set(); });
    completions.forEach(c => {
      const key = c.habitId.toString();
      if (completionMap[key]) completionMap[key].add(c.date);
    });

    // Today's completions
    const completedToday = habits.filter(h => completionMap[h._id.toString()].has(today)).length;

    // Per-habit stats
    const habitStats = habits.map(h => {
      const dates = completionMap[h._id.toString()];
      const streak = calculateStreak(dates);
      const last30Count = [...dates].filter(d => last30Days.includes(d)).length;
      const completionRate = Math.round((last30Count / 30) * 100);
      return { id: h._id, title: h.title, color: h.color, streak, completionRate };
    });

    const bestStreak = habitStats.reduce((max, h) => Math.max(max, h.streak), 0);

    // Overall completion rate
    const totalPossible = totalHabits * 30;
    const totalCompleted = completions.length;
    const overallRate = Math.round((totalCompleted / totalPossible) * 100);

    // Weekly chart data
    const weeklyData = last7Days.map(date => {
      const completed = habits.filter(h => completionMap[h._id.toString()].has(date)).length;
      return {
        date,
        label: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
        completed, total: totalHabits,
        percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0
      };
    });

    // Monthly data
    const monthlyData = last30Days.map(date => {
      const completed = habits.filter(h => completionMap[h._id.toString()].has(date)).length;
      return { date, completed, total: totalHabits };
    });

    // Perfect days (all habits done) in last 30 days
    const perfectDays = last30Days.filter(date => {
      if (totalHabits === 0) return false;
      const doneCount = habits.filter(h => completionMap[h._id.toString()].has(date)).length;
      return doneCount === totalHabits;
    }).length;

    res.json({
      overview: { totalHabits, completedToday, bestStreak, overallRate,
                  totalCompletions: completions.length, perfectDays },
      habitStats,
      weeklyData,
      monthlyData
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

module.exports = { getDashboardStats };
