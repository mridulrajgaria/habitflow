// Milestone badge definitions
export const BADGES = [
  { id: 'first_habit',    emoji: '🌱', name: 'Planted',       desc: 'Created your first habit',         check: (s) => s.totalHabits >= 1 },
  { id: 'first_done',     emoji: '⚡', name: 'First Strike',  desc: 'Completed a habit for the first time', check: (s) => s.totalCompletions >= 1 },
  { id: 'week_warrior',   emoji: '🔥', name: 'Week Warrior',  desc: '7-day streak on any habit',        check: (s) => s.bestStreak >= 7 },
  { id: 'iron_will',      emoji: '💎', name: 'Iron Will',     desc: '30-day streak on any habit',       check: (s) => s.bestStreak >= 30 },
  { id: 'perfect_week',   emoji: '🏆', name: 'Perfect Week',  desc: '100% completion for 7 days',       check: (s) => s.perfectDays >= 7 },
  { id: 'perfect_month',  emoji: '👑', name: 'Perfect Month', desc: '100% completion for 30 days',      check: (s) => s.perfectDays >= 30 },
  { id: 'collector',      emoji: '🎯', name: 'Collector',     desc: 'Tracking 5 or more habits',        check: (s) => s.totalHabits >= 5 },
  { id: 'centurion',      emoji: '💯', name: 'Centurion',     desc: '100 total completions',            check: (s) => s.totalCompletions >= 100 },
  { id: 'consistent',     emoji: '📅', name: 'Consistent',    desc: 'Completed habits 14 days in a row', check: (s) => s.bestStreak >= 14 },
  { id: 'multi_tasker',   emoji: '🤹', name: 'Multi-Tasker',  desc: 'Completed all habits in one day',  check: (s) => s.hadPerfectDay },
];

export function getEarnedBadges(stats) {
  return BADGES.filter(b => b.check(stats));
}

export function BadgeGrid({ stats, compact = false }) {
  const earned = getEarnedBadges(stats);
  const all = BADGES;

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {earned.slice(0, 5).map(b => (
          <span key={b.id} title={`${b.name}: ${b.desc}`}
            style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
            {b.emoji}
          </span>
        ))}
        {earned.length > 5 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', fontWeight: 700 }}>
            +{earned.length - 5}
          </span>
        )}
        {earned.length === 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No badges yet — keep going!</span>
        )}
      </div>
    );
  }

  return (
    <div className="badge-grid">
      {all.map(b => {
        const isEarned = b.check(stats);
        return (
          <div key={b.id} className={`badge-item ${isEarned ? 'earned' : 'locked'}`} title={b.desc}>
            <div className="badge-emoji">{isEarned ? b.emoji : '🔒'}</div>
            <div className="badge-name">{b.name}</div>
            <div className="badge-desc">{b.desc}</div>
          </div>
        );
      })}
    </div>
  );
}
