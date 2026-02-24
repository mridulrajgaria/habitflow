import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function NoteModal({ habit, onConfirm, onClose }) {
  const [note, setNote] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus after mount
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(note.trim());
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-scale" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.1rem' }}>Complete Habit</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
              {habit.title}
            </p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Add a note <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <textarea
              ref={inputRef}
              placeholder="How did it go? Any thoughts..."
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={300}
              rows={3}
            />
            {note.length > 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                {note.length}/300
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} /> Mark Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
