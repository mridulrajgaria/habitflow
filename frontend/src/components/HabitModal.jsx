import { useState } from 'react';
import { X } from 'lucide-react';
import './HabitModal.css';

const COLORS = [
  '#7c6af7', '#06b6d4', '#22c55e', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
  '#f97316', '#6366f1'
];

const CATEGORIES = [
  { value: 'general', label: 'General', emoji: '✨' },
  { value: 'health', label: 'Health', emoji: '💊' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
  { value: 'productivity', label: 'Productivity', emoji: '⚡' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'social', label: 'Social', emoji: '🤝' },
];

export default function HabitModal({ habit, onSave, onClose }) {
  const [form, setForm] = useState({
    title: habit?.title || '',
    description: habit?.description || '',
    color: habit?.color || '#7c6af7',
    category: habit?.category || 'general'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave(form);
    } catch {
      setError('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale">
        <div className="modal-header">
          <h2>{habit ? 'Edit Habit' : 'New Habit'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="e.g. Morning run, Read 30 min..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Optional description or motivation..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              maxLength={500}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-grid">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  className={`category-btn ${form.category === cat.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, category: cat.value })}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 28 }}>
            <label>Color</label>
            <div className="color-picker">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${form.color === color ? 'selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => setForm({ ...form, color })}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <span className="spinner" /> : habit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
