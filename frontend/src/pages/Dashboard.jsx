import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Target, TrendingUp, CheckCheck, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { DashboardHeroIllustration } from '../components/Illustrations';
import { BadgeGrid } from '../components/Badges';
import './Dashboard.css';

const STAT_CONFIGS = [
  { key: 'today',   icon: CheckCheck, label: 'Done Today',   color: '#6c63ff', bg: 'rgba(108,99,255,0.15)'  },
  { key: 'streak',  icon: Flame,      label: 'Best Streak',  color: '#f953c6', bg: 'rgba(249,83,198,0.15)'  },
  { key: 'rate',    icon: TrendingUp, label: '30-Day Rate',  color: '#00e5a0', bg: 'rgba(0,229,160,0.15)'   },
  { key: 'total',   icon: Target,     label: 'Total Habits', color: '#3bc4f2', bg: 'rgba(59,196,242,0.15)'  },
];

const StatCard = ({ icon: Icon, label, value, suffix = '', color, bg, delay = 0 }) => (
  <div className="stat-card animate-fade" style={{ '--card-color': color }}>
    <div className="stat-icon" style={{ background: bg, color }}>
      <Icon size={20} />
    </div>
    <div className="stat-value">
      <span className="stat-number" style={{ color }}>{value}</span>
      {suffix && <span className="stat-suffix">{suffix}</span>}
    </div>
    <div className="stat-label">{label}</div>
  </div>
);

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 14px' }}>
      <div style={{ color: '#a0a0c0', fontSize: '0.78rem', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{payload[0].value}%</div>
      <div style={{ color: '#606080', fontSize: '0.75rem' }}>{payload[0].payload.completed}/{payload[0].payload.total} habits</div>
    </div>
  );
};

const LineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 14px' }}>
      <div style={{ color: '#a0a0c0', fontSize: '0.78rem', marginBottom: 4 }}>
        {new Date(label + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
      <div style={{ color: '#6c63ff', fontWeight: 700 }}>{payload[0].value} habits done</div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = () => {
    setLoading(true); setError(false);
    api.get('/api/stats/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );

  if (error) return (
    <div className="dashboard-error card animate-fade">
      <div style={{ fontSize: '3.5rem' }}>⚡</div>
      <h2>Couldn't load dashboard</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Check your connection and try again.</p>
      <button className="btn btn-primary" onClick={fetchStats}>
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  const { overview, habitStats, weeklyData, monthlyData } = stats;

  const statValues = [
    { ...STAT_CONFIGS[0], value: `${overview.completedToday}/${overview.totalHabits}` },
    { ...STAT_CONFIGS[1], value: overview.bestStreak, suffix: ' days' },
    { ...STAT_CONFIGS[2], value: overview.overallRate, suffix: '%' },
    { ...STAT_CONFIGS[3], value: overview.totalHabits },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-hero animate-fade">
        <div className="dashboard-hero-illus"><DashboardHeroIllustration /></div>
      </div>

      <div className="dashboard-header animate-fade">
        <div>
          <h1>{greeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="dashboard-subtitle">
            {overview.totalHabits === 0
              ? 'Add your first habit to get started'
              : overview.completedToday === overview.totalHabits
              ? "All habits crushed today! You're on fire 🔥"
              : `${overview.completedToday} of ${overview.totalHabits} habits done today`}
          </p>
        </div>
        {overview.totalHabits === 0 && (
          <Link to="/habits" className="btn btn-primary">
            <Zap size={16} /> Start tracking
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statValues.map((s, i) => (
          <StatCard key={s.key} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="charts-row">
        {/* Weekly bar chart */}
        <div className="chart-card animate-fade">
          <div className="chart-header">
            <h2>Weekly Progress</h2>
            <span className="chart-subtitle">Completion % by day</span>
          </div>
          {overview.totalHabits > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#606080', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.percentage === 100 ? '#00e5a0' :
                        entry.percentage >= 70  ? '#6c63ff' :
                        entry.percentage >= 40  ? '#f953c6' :
                        entry.percentage > 0    ? '#ff7849' :
                        'rgba(255,255,255,0.06)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <span style={{ fontSize: '2.5rem' }}>📊</span>
              <p>No habits yet</p>
              <Link to="/habits" className="btn btn-secondary btn-sm">Add habits <ArrowRight size={14} /></Link>
            </div>
          )}
        </div>

        {/* 30-day area chart */}
        <div className="chart-card animate-fade">
          <div className="chart-header">
            <h2>30-Day Trend</h2>
            <span className="chart-subtitle">Completions over time</span>
          </div>
          {overview.totalHabits > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#606080', fontSize: 10, fontWeight: 600 }}
                  tickFormatter={d => new Date(d + 'T12:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  interval={6} axisLine={false} tickLine={false}
                />
                <YAxis domain={[0, overview.totalHabits]} tick={{ fill: '#606080', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<LineTooltip />} />
                <Area type="monotone" dataKey="completed" stroke="#6c63ff" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: '#6c63ff', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <span style={{ fontSize: '2.5rem' }}>📈</span>
              <p>No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Streak leaderboard */}
      {habitStats.length > 0 && (
        <div className="card animate-fade">
          <div className="chart-header" style={{ marginBottom: 18 }}>
            <h2>🏆 Habit Streaks</h2>
            <Link to="/habits" className="btn btn-ghost btn-sm">Manage <ArrowRight size={14} /></Link>
          </div>
          <div className="habit-leaderboard">
            {habitStats.slice(0, 6).map((h, i) => (
              <div key={h.id || i} className="leaderboard-item">
                <div className="leaderboard-rank" style={{ color: i === 0 ? '#ffd60a' : i === 1 ? '#a0a0c0' : i === 2 ? '#ff7849' : undefined }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div className="leaderboard-color" style={{ background: h.color, boxShadow: `0 0 6px ${h.color}` }} />
                <div className="leaderboard-name">{h.title}</div>
                <div className="leaderboard-bar-container">
                  <div className="leaderboard-bar" style={{ width: `${h.completionRate}%`, background: `linear-gradient(90deg, ${h.color}99, ${h.color})` }} />
                </div>
                <div className="leaderboard-rate">{h.completionRate}%</div>
                <div className="leaderboard-streak">
                  <Flame size={13} style={{ color: '#f953c6' }} />{h.streak}d
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {overview.totalHabits > 0 && (
        <div className="card animate-fade">
          <div className="chart-header" style={{ marginBottom: 18 }}>
            <h2>🏅 Achievements</h2>
            <span className="chart-subtitle">Earn badges by building streaks</span>
          </div>
          <BadgeGrid stats={{
            totalHabits: overview.totalHabits,
            totalCompletions: overview.totalCompletions || 0,
            bestStreak: overview.bestStreak || 0,
            perfectDays: overview.perfectDays || 0,
            hadPerfectDay: overview.completedToday === overview.totalHabits && overview.totalHabits > 0,
          }} />
        </div>
      )}

      {/* Empty */}
      {overview.totalHabits === 0 && (
        <div className="card animate-fade" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(249,83,198,0.05))' }}>
          <div className="empty-state">
            <div style={{ fontSize: '4.5rem' }}>🚀</div>
            <h2>Ready to level up?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 360 }}>
              Build habits that stick. Start small, stay consistent, and watch yourself transform.
            </p>
            <Link to="/habits" className="btn btn-primary" style={{ padding: '13px 32px', fontSize: '1rem' }}>
              <Zap size={18} /> Add your first habit
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
