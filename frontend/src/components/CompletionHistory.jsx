import { useState, useEffect } from 'react';
import { X, Flame, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import api from '../utils/api';
import './CompletionHistory.css';

const CATEGORIES = {
  health: '💊', fitness: '💪', learning: '📚', mindfulness: '🧘',
  productivity: '⚡', creative: '🎨', social: '🤝', general: '✨',
};

// Get last N days as YYYY-MM-DD
const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const calculateStreak = (dateSet) => {
  let streak = 0;
  let check = new Date();
  const today = check.toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (!dateSet.has(today) && !dateSet.has(yesterday)) return 0;
  if (!dateSet.has(today)) check = new Date(Date.now() - 86400000);
  while (true) {
    const ds = check.toISOString().split('T')[0];
    if (dateSet.has(ds)) { streak++; check = new Date(check - 86400000); }
    else break;
  }
  return streak;
};

const calculateLongestStreak = (dateSet) => {
  const dates = [...dateSet].sort();
  let longest = 0, current = 0;
  for (let i = 0; i < dates.length; i++) {
    if (i === 0) { current = 1; }
    else {
      const prev = new Date(dates[i-1] + 'T12:00');
      const curr = new Date(dates[i] + 'T12:00');
      const diff = (curr - prev) / 86400000;
      current = diff === 1 ? current + 1 : 1;
    }
    longest = Math.max(longest, current);
  }
  return longest;
};

export default function CompletionHistory({ habit, onClose }) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const last30 = getLastNDays(30);
  const emoji = CATEGORIES[habit.category] || '✨';

  useEffect(() => {
    api.get(`/api/completions/${habit._id}`)
      .then(({ data }) => setCompletions(data.completions))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [habit._id]);

  const dateSet = new Set(completions.map(c => c.date));
  const streak = calculateStreak(dateSet);
  const longestStreak = calculateLongestStreak(dateSet);
  const last30Set = new Set([...dateSet].filter(d => d >= getLastNDays(30)[0]));
  const completionRate = Math.round((last30Set.size / 30) * 100);
  const totalEver = completions.length; // within last 30 days shown

  // Group by week for the heatmap (6 rows × 7 cols = 42 cells, show last 35)
  const calDays = getLastNDays(35);

  // Sort completions by date desc for the log
  const sorted = [...completions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="history-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="history-drawer animate-slide-up">
        {/* Header */}
        <div className="history-header">
          <div className="history-title">
            <span className="history-emoji">{emoji}</span>
            <div>
              <h2>{habit.title}</h2>
              {habit.description && <p className="history-desc">{habit.description}</p>}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
          </div>
        ) : error ? (
          <div className="history-error">
            <span>⚠️</span>
            <p>Failed to load history</p>
            <button className="btn btn-secondary btn-sm" onClick={() => {
              setError(false); setLoading(true);
              api.get(`/api/completions/${habit._id}`)
                .then(({ data }) => setCompletions(data.completions))
                .catch(() => setError(true))
                .finally(() => setLoading(false));
            }}>Retry</button>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="history-stats">
              <div className="hstat">
                <Flame size={18} style={{ color: '#f59e0b' }} />
                <div className="hstat-value">{streak}</div>
                <div className="hstat-label">Day streak</div>
              </div>
              <div className="hstat">
                <TrendingUp size={18} style={{ color: '#22c55e' }} />
                <div className="hstat-value">{completionRate}%</div>
                <div className="hstat-label">30-day rate</div>
              </div>
              <div className="hstat">
                <CheckCircle size={18} style={{ color: habit.color }} />
                <div className="hstat-value">{dateSet.size}</div>
                <div className="hstat-label">Last 30 days</div>
              </div>
              <div className="hstat">
                <Calendar size={18} style={{ color: 'var(--accent)' }} />
                <div className="hstat-value">{new Date(habit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <div className="hstat-label">Started</div>
              </div>
              <div className="hstat" style={{ gridColumn: '1 / -1', background: 'rgba(249,83,198,0.06)', borderColor: 'rgba(249,83,198,0.2)' }}>
                <Flame size={18} style={{ color: '#f953c6' }} />
                <div className="hstat-value" style={{ color: '#f953c6' }}>🏆 {longestStreak} days</div>
                <div className="hstat-label">Personal best streak</div>
              </div>
            </div>

            {/* Calendar heatmap */}
            <div className="history-section">
              <h3 className="history-section-title">35-Day Calendar</h3>
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="cal-day-label">{d}</div>
                ))}
                {/* Offset for first day of week */}
                {(() => {
                  const firstDay = new Date(calDays[0] + 'T12:00:00').getDay();
                  return Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="cal-cell empty" />
                  ));
                })()}
                {calDays.map(date => {
                  const done = dateSet.has(date);
                  const isToday = date === new Date().toISOString().split('T')[0];
                  const completion = completions.find(c => c.date === date);
                  const dayNum = new Date(date + 'T12:00:00').getDate();
                  return (
                    <div
                      key={date}
                      className={`cal-cell ${done ? 'done' : 'empty-day'} ${isToday ? 'today' : ''}`}
                      style={done
                        ? { background: `linear-gradient(135deg, ${habit.color}cc, ${habit.color})`,
                            boxShadow: `0 4px 14px ${habit.color}66` }
                        : isToday
                        ? { borderColor: 'rgba(255,255,255,0.3)' }
                        : {}}
                      title={`${date}${completion?.note ? ' — ' + completion.note : ''}`}
                    >
                      <span className="cal-day-num">{dayNum}</span>
                      {done && (
                        <span className="cal-check">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <polyline points="3,8 6.5,12 13,4"
                              stroke="white" strokeWidth="2.2"
                              strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="cal-legend">
                <span>Less</span>
                <div className="cal-legend-box empty-day" />
                <div className="cal-legend-box" style={{ background: habit.color, opacity: 0.5 }} />
                <div className="cal-legend-box" style={{ background: habit.color }} />
                <span>More</span>
              </div>
            </div>

            {/* Completion log */}
            <div className="history-section">
              <h3 className="history-section-title">Completion Log</h3>
              {sorted.length === 0 ? (
                <div className="history-empty">
                  <span>📋</span>
                  <p>No completions yet. Start today!</p>
                </div>
              ) : (
                <div className="completion-log">
                  {sorted.map(c => (
                    <div key={c._id} className="log-item">
                      <div
                        className="log-dot"
                        style={{ background: habit.color }}
                      />
                      <div className="log-content">
                        <div className="log-date">
                          {new Date(c.date + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric'
                          })}
                        </div>
                        {c.note && <div className="log-note">"{c.note}"</div>}
                      </div>
                      <div className="log-check" style={{ color: habit.color }}>
                        <CheckCircle size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
