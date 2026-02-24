import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Check, Flame, Edit2, Trash2, Sparkles, History, Search, X, Volume2, VolumeX, Archive } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import HabitModal from '../components/HabitModal';
import CompletionHistory from '../components/CompletionHistory';
import NoteModal from '../components/NoteModal';
import Confetti from '../components/Confetti';
import { EmptyHabitsIllustration } from '../components/Illustrations';
import { useCompletionSound } from '../utils/sound';
import './Habits.css';

const CATEGORIES = {
  health:       { label: 'Health',       emoji: '💊' },
  fitness:      { label: 'Fitness',      emoji: '💪' },
  learning:     { label: 'Learning',     emoji: '📚' },
  mindfulness:  { label: 'Mindfulness',  emoji: '🧘' },
  productivity: { label: 'Productivity', emoji: '⚡' },
  creative:     { label: 'Creative',     emoji: '🎨' },
  social:       { label: 'Social',       emoji: '🤝' },
  general:      { label: 'General',      emoji: '✨' },
};

const MOTIVATIONAL = [
  "Small steps lead to big changes.",
  "Every check-in counts.",
  "You're building the future version of yourself.",
  "Consistency beats perfection.",
  "One habit at a time.",
  "Show up today. Your future self will thank you.",
  "Progress, not perfection.",
  "Winners are not people who never fail, but who never quit.",
];

// Flame level based on streak
function StreakFlame({ streak }) {
  if (streak < 3) return null;
  const level = streak >= 30 ? 3 : streak >= 14 ? 2 : streak >= 7 ? 1 : 0;
  if (level === 0) return null;
  const sizes  = ['1rem', '1.1rem', '1.25rem', '1.4rem'];
  const glows  = ['none', '0 0 6px #f59e0b', '0 0 10px #f97316', '0 0 16px #ef4444'];
  return (
    <span title={`${streak} day streak!`}
      style={{ fontSize: sizes[level], filter: glows[level] !== 'none' ? `drop-shadow(${glows[level]})` : 'none',
        lineHeight: 1, animation: level >= 2 ? 'flamePulse 1.5s ease-in-out infinite' : 'none' }}>
      🔥
    </span>
  );
}

const HabitCard = ({ habit, onToggle, onEdit, onDelete, onViewHistory, onArchive, toggling, isNew }) => {
  const [showDelete, setShowDelete] = useState(false);
  const cat = CATEGORIES[habit.category] || CATEGORIES.general;
  const isToggling = toggling === habit._id;

  return (
    <div
      className={`habit-card ${habit.completedToday ? 'completed' : ''} ${isNew ? 'habit-card-new' : ''}`}
      style={{ '--habit-color': habit.color, borderLeftColor: habit.color }}
    >
      {/* Color glow left border */}
      <div className="habit-color-bar" style={{ background: habit.color }} />

      <div className="habit-card-left">
        <button
          className={`check-btn ${habit.completedToday ? 'checked' : ''} ${isToggling ? 'toggling' : ''}`}
          style={{ '--habit-color': habit.color }}
          onClick={() => onToggle(habit)}
          disabled={isToggling}
          aria-label={habit.completedToday ? 'Mark incomplete' : 'Mark complete'}
        >
          {isToggling
            ? <span className="spinner" style={{ width: 14, height: 14 }} />
            : habit.completedToday ? <Check size={16} strokeWidth={3} /> : null}
        </button>

        <div className="habit-info">
          <div className="habit-title-row">
            <span className="habit-emoji">{cat.emoji}</span>
            <h3 className="habit-title">{habit.title}</h3>
            <StreakFlame streak={habit.streak || 0} />
          </div>
          {habit.description && <p className="habit-desc">{habit.description}</p>}
          <div className="habit-meta">
            <span className="habit-category">{cat.label}</span>
            {habit.streak > 0 && (
              <span className="habit-streak-badge">🔥 {habit.streak}d streak</span>
            )}
            {habit.completedToday && (
              <span className="habit-done-badge"><Check size={10} /> Done today</span>
            )}
            {habit.todayNote && (
              <span className="habit-note-preview" title={habit.todayNote}>
                📝 {habit.todayNote.length > 28 ? habit.todayNote.slice(0, 28) + '…' : habit.todayNote}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="habit-card-right">
        <div className="habit-actions">
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onViewHistory(habit)} title="View history"><History size={15} /></button>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(habit)} title="Edit"><Edit2 size={15} /></button>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onArchive(habit._id)} title="Archive" style={{ color: 'var(--text-muted)' }}><Archive size={15} /></button>
          {!showDelete ? (
            <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--danger)' }}
              onClick={() => setShowDelete(true)} title="Delete"><Trash2 size={15} /></button>
          ) : (
            <div className="delete-confirm animate-scale">
              <span>Delete?</span>
              <button className="btn btn-danger btn-sm" onClick={() => { onDelete(habit._id); setShowDelete(false); }}>Yes</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDelete(false)}>No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Grade calculator
function getWeekGrade(rate) {
  if (rate >= 95) return { grade: 'A+', color: '#00e5a0', msg: 'Outstanding! 🌟' };
  if (rate >= 85) return { grade: 'A',  color: '#00e5a0', msg: 'Excellent work!' };
  if (rate >= 75) return { grade: 'B+', color: '#3bc4f2', msg: 'Great job!' };
  if (rate >= 65) return { grade: 'B',  color: '#3bc4f2', msg: 'Good progress!' };
  if (rate >= 55) return { grade: 'C+', color: '#ffd60a', msg: 'Keep pushing!' };
  if (rate >= 45) return { grade: 'C',  color: '#ffd60a', msg: 'Room to improve.' };
  if (rate >= 35) return { grade: 'D',  color: '#ff7849', msg: 'Need more effort.' };
  return               { grade: 'F',  color: '#ff4d6d', msg: 'Start fresh today!' };
}

export default function Habits() {
  const [habits, setHabits]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);
  const [toggling, setToggling]       = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [historyHabit, setHistoryHabit] = useState(null);
  const [noteHabit, setNoteHabit]     = useState(null);
  const [confetti, setConfetti]       = useState(false);
  const [newHabitId, setNewHabitId]   = useState(null);
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState('all');
  const [soundOn, setSoundOn]         = useState(() => localStorage.getItem('habitflow_sound') !== 'off');
  const [weekRate, setWeekRate]       = useState(0);
  const [quote]                       = useState(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]);
  const prevAllDone                   = useRef(false);
  const searchRef                     = useRef(null);
  const toast    = useToast();
  const { play } = useCompletionSound();
  const today    = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const fetchHabits = useCallback(async () => {
    setError(false);
    try {
      const { data } = await api.get('/api/habits');
      setHabits(data.habits);
    } catch {
      setError(true);
      toast.error('Failed to load habits');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  // Fetch weekly rate for grade
  useEffect(() => {
    api.get('/api/stats/dashboard').then(({ data }) => {
      setWeekRate(data.overview?.overallRate || 0);
    }).catch(() => {});
  }, [habits]);

  // Confetti when all done
  useEffect(() => {
    if (habits.length === 0) return;
    const allDone = habits.every(h => h.completedToday);
    if (allDone && !prevAllDone.current) {
      setTimeout(() => setConfetti(true), 300);
      if (soundOn) play('allDone');
    }
    prevAllDone.current = allDone;
  }, [habits]);

  // ⌨️ Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setEditingHabit(null); setModalOpen(true); }
      if (e.key === 's' || e.key === 'S') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setSearch(''); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('habitflow_sound', next ? 'on' : 'off');
    toast.info(next ? '🔔 Sound on' : '🔇 Sound off');
  };

  const handleToggleClick = (habit) => {
    if (!habit.completedToday) setNoteHabit(habit);
    else doToggle(habit._id, null);
  };

  const doToggle = async (habitId, note) => {
    setToggling(habitId); setNoteHabit(null);
    try {
      const { data } = await api.post(`/api/completions/${habitId}/toggle`, { note });
      setHabits(prev => prev.map(h =>
        h._id === habitId
          ? { ...h, completedToday: data.completed, todayNote: data.completed ? (note || '') : '' }
          : h
      ));
      if (data.completed) {
        toast.success('🔥 Habit completed!');
        if (soundOn) play('complete');
      } else {
        toast.info('Habit unmarked');
        if (soundOn) play('uncomplete');
      }
    } catch { toast.error('Failed to update habit'); }
    finally { setToggling(null); }
  };

  const handleDelete = async (habitId) => {
    try {
      await api.delete(`/api/habits/${habitId}`);
      setHabits(prev => prev.filter(h => h._id !== habitId));
      toast.success('Habit deleted');
    } catch { toast.error('Failed to delete habit'); }
  };

  const handleArchive = async (habitId) => {
    try {
      await api.patch(`/api/habits/${habitId}/archive`);
      setHabits(prev => prev.filter(h => h._id !== habitId));
      toast.success('Habit archived — you can restore it later');
    } catch { toast.error('Failed to archive habit'); }
  };

  const handleSave = async (habitData) => {
    try {
      if (editingHabit) {
        const { data } = await api.put(`/api/habits/${editingHabit._id}`, habitData);
        setHabits(prev => prev.map(h => h._id === editingHabit._id ? { ...h, ...data.habit } : h));
        toast.success('Habit updated!');
      } else {
        const { data } = await api.post('/api/habits', habitData);
        const newHabit = { ...data.habit, completedToday: false };
        setHabits(prev => [...prev, newHabit]);
        setNewHabitId(newHabit._id);
        setTimeout(() => setNewHabitId(null), 800);
        toast.success('Habit created! 🌱');
      }
      setModalOpen(false); setEditingHabit(null);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save habit'); }
  };

  // Filter & search
  const filtered = habits.filter(h => {
    const matchSearch = h.title.toLowerCase().includes(search.toLowerCase()) ||
                        h.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || h.category === filterCat;
    return matchSearch && matchCat;
  });

  const completedCount = habits.filter(h => h.completedToday).length;
  const allDone        = completedCount === habits.length && habits.length > 0;
  const progressPct    = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const grade          = getWeekGrade(weekRate);
  const pending        = filtered.filter(h => !h.completedToday);
  const completed      = filtered.filter(h =>  h.completedToday);
  const usedCategories = [...new Set(habits.map(h => h.category))];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'50vh' }}>
      <div className="spinner" style={{ width:36, height:36, borderWidth:3 }} />
    </div>
  );

  if (error) return (
    <div className="error-state card animate-fade">
      <div style={{ fontSize:'3.5rem' }}>⚠️</div>
      <h2>Failed to load habits</h2>
      <p style={{ color:'var(--text-secondary)' }}>Check your connection and try again.</p>
      <button className="btn btn-primary" onClick={() => { setLoading(true); fetchHabits(); }}>Try Again</button>
    </div>
  );

  return (
    <div className="habits-page">
      <Confetti active={confetti} onDone={() => setConfetti(false)} />

      {/* Header */}
      <div className="habits-header animate-fade">
        <div>
          <h1>My Habits</h1>
          <p className="habits-date">{today}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Sound toggle */}
          <button className="btn btn-ghost btn-icon" onClick={toggleSound} title={soundOn ? 'Mute sounds' : 'Enable sounds'}>
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingHabit(null); setModalOpen(true); }}>
            <Plus size={18} /> Add Habit
          </button>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="kbd-hints animate-fade" style={{ animationDelay: '40ms' }}>
        <span className="kbd-hint"><kbd>N</kbd> New habit</span>
        <span className="kbd-hint"><kbd>S</kbd> Search</span>
        <span className="kbd-hint"><kbd>Esc</kbd> Clear</span>
      </div>

      {/* Progress + Grade row */}
      {habits.length > 0 && (
        <div className="progress-grade-row animate-fade" style={{ animationDelay: '60ms' }}>
          <div className="progress-section" style={{ flex: 1 }}>
            <div className="progress-header">
              <span>Today's Progress</span>
              <span className="progress-fraction">{completedCount}/{habits.length} · {progressPct}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
            {allDone && (
              <div className="all-done-banner animate-pop">
                <Flame size={16} style={{ color:'#f59e0b' }} />
                All habits crushed today! You're on fire 🔥
                <Sparkles size={16} style={{ color:'#a78bfa' }} />
              </div>
            )}
          </div>

          {/* Weekly Report Card */}
          <div className="grade-card" style={{ borderColor: grade.color + '44' }}>
            <div className="grade-value" style={{ color: grade.color }}>{grade.grade}</div>
            <div className="grade-label">This week</div>
            <div className="grade-msg">{grade.msg}</div>
          </div>
        </div>
      )}

      {/* Quote */}
      {habits.length > 0 && (
        <div className="quote-bar animate-fade" style={{ animationDelay: '100ms' }}>
          "{quote}"
        </div>
      )}

      {/* Search + Filter bar */}
      {habits.length > 0 && (
        <div className="search-filter-bar animate-fade" style={{ animationDelay: '120ms' }}>
          <div className="search-input-wrap">
            <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search habits…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="btn btn-ghost btn-icon" style={{ padding: 4 }} onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <div className="filter-pills">
            <button className={`filter-pill ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>All</button>
            {usedCategories.map(cat => {
              const c = CATEGORIES[cat];
              return (
                <button key={cat} className={`filter-pill ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>
                  {c.emoji} {c.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {habits.length === 0 ? (
        <div className="empty-state card animate-fade" style={{ gap: 8 }}>
          <div style={{ marginBottom: 8 }}><EmptyHabitsIllustration /></div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>No habits yet</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 300 }}>
            Plant the seed of consistency. Add your first habit and watch yourself grow.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add your first habit
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state animate-fade">
          <div style={{ fontSize: '2.5rem' }}>🔍</div>
          <p style={{ color: 'var(--text-secondary)' }}>No habits match "{search}"</p>
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterCat('all'); }}>Clear filters</button>
        </div>
      ) : (
        <div className="habits-list">
          {pending.map((habit, i) => (
            <div key={habit._id} className="animate-fade" style={{ animationDelay: `${i * 50}ms` }}>
              <HabitCard habit={habit} onToggle={handleToggleClick} onEdit={h => { setEditingHabit(h); setModalOpen(true); }}
                onDelete={handleDelete} onArchive={handleArchive} onViewHistory={setHistoryHabit}
                toggling={toggling} isNew={habit._id === newHabitId} />
            </div>
          ))}

          {completed.length > 0 && (
            <>
              {pending.length > 0 && <div className="section-divider">Completed today ✓</div>}
              {completed.map((habit, i) => (
                <div key={habit._id} className="animate-fade" style={{ animationDelay: `${(pending.length + i) * 50}ms` }}>
                  <HabitCard habit={habit} onToggle={handleToggleClick} onEdit={h => { setEditingHabit(h); setModalOpen(true); }}
                    onDelete={handleDelete} onArchive={handleArchive} onViewHistory={setHistoryHabit}
                    toggling={toggling} isNew={false} />
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {noteHabit && <NoteModal habit={noteHabit} onConfirm={(note) => doToggle(noteHabit._id, note)} onClose={() => setNoteHabit(null)} />}
      {modalOpen && <HabitModal habit={editingHabit} onSave={handleSave} onClose={() => { setModalOpen(false); setEditingHabit(null); }} />}
      {historyHabit && <CompletionHistory habit={historyHabit} onClose={() => setHistoryHabit(null)} />}
    </div>
  );
}
