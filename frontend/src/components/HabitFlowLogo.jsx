// HabitFlow Logo — Flame + Checkmark, Purple→Pink gradient
// Use as: <HabitFlowLogo size={36} /> or <HabitFlowLogo showText />

export default function HabitFlowLogo({ size = 36, showText = false, animate = false }) {
  const id = `hf-${size}`;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      {/* Icon mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          {/* Main flame gradient: purple → pink */}
          <linearGradient id={`${id}-g1`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6c63ff" />
            <stop offset="55%"  stopColor="#c84bef" />
            <stop offset="100%" stopColor="#f953c6" />
          </linearGradient>

          {/* Inner flame gradient: lighter */}
          <linearGradient id={`${id}-g2`} x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%"   stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f9a8d4" />
          </linearGradient>

          {/* Check gradient */}
          <linearGradient id={`${id}-g3`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.9" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Drop shadow */}
          <filter id={`${id}-shadow`} x="-10%" y="-10%" width="130%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" stopColor="#6c63ff" stopOpacity="0.5"/>
          </filter>
        </defs>

        {/* ── Outer flame body ── */}
        {/* Main flame: wide base sweeping up to a tip */}
        <path
          d="
            M 24 44
            C 14 44 7 37 7 28
            C 7 22 10 17 13 13
            C 13 19 16 22 19 21
            C 16 16 17 10 22 6
            C 22 11 25 15 28 14
            C 32 10 33 6 33 6
            C 37 11 41 18 41 26
            C 41 36 34 44 24 44
            Z
          "
          fill={`url(#${id}-g1)`}
          filter={`url(#${id}-shadow)`}
        >
          {animate && (
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1 1; 1.01 0.99; 0.99 1.01; 1 1"
              dur="2s"
              repeatCount="indefinite"
              additive="sum"
            />
          )}
        </path>

        {/* Inner flame highlight — smaller, lighter */}
        <path
          d="
            M 24 38
            C 18 38 14 33 14 28
            C 14 24 16 21 18 19
            C 18 23 20 25 22 24
            C 20 21 21 17 24 14
            C 24 18 27 21 29 20
            C 31 18 32 15 32 15
            C 35 19 36 23 36 27
            C 36 33 31 38 24 38
            Z
          "
          fill={`url(#${id}-g2)`}
          opacity="0.55"
        />

        {/* ── Checkmark ── bold, centred in lower-mid flame */}
        <g filter={`url(#${id}-glow)`}>
          <polyline
            points="17,27 22,33 32,20"
            stroke={`url(#${id}-g3)`}
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {animate && (
              <>
                <animate
                  attributeName="stroke-dasharray"
                  from="0,40"
                  to="40,0"
                  dur="0.6s"
                  begin="0.2s"
                  fill="freeze"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  from="40"
                  to="0"
                  dur="0.6s"
                  begin="0.2s"
                  fill="freeze"
                />
              </>
            )}
          </polyline>
        </g>
      </svg>

      {/* Optional wordmark */}
      {showText && (
        <span style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: size * 0.62,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #a78bfa 0%, #f953c6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          userSelect: 'none',
        }}>
          HabitFlow
        </span>
      )}
    </span>
  );
}
