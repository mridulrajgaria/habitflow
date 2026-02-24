// Abstract gradient art illustrations as inline SVGs

export const LoginIllustration = () => (
  <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="lg1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f953c6" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#6c63ff" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="lg2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3bc4f2" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#6c63ff" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="lg3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#f953c6" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="ring1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f953c6"/>
        <stop offset="100%" stopColor="#6c63ff"/>
      </linearGradient>
      <linearGradient id="ring2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3bc4f2"/>
        <stop offset="100%" stopColor="#00e5a0"/>
      </linearGradient>
      <filter id="blur1"><feGaussianBlur stdDeviation="20"/></filter>
      <filter id="blur2"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>

    {/* Background blobs */}
    <ellipse cx="300" cy="80" rx="130" ry="110" fill="url(#lg1)" filter="url(#blur1)" opacity="0.9"/>
    <ellipse cx="80" cy="240" rx="110" ry="100" fill="url(#lg2)" filter="url(#blur1)" opacity="0.8"/>
    <ellipse cx="200" cy="160" rx="90" ry="80" fill="url(#lg3)" filter="url(#blur1)" opacity="0.5"/>

    {/* Floating rings */}
    <circle cx="200" cy="150" r="90" stroke="url(#ring1)" strokeWidth="1.5" fill="none" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="20s" repeatCount="indefinite"/>
    </circle>
    <circle cx="200" cy="150" r="65" stroke="url(#ring2)" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="8 4">
      <animateTransform attributeName="transform" type="rotate" from="360 200 150" to="0 200 150" dur="15s" repeatCount="indefinite"/>
    </circle>
    <circle cx="200" cy="150" r="120" stroke="url(#ring1)" strokeWidth="0.8" fill="none" opacity="0.2" strokeDasharray="4 8">
      <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="30s" repeatCount="indefinite"/>
    </circle>

    {/* Center orb */}
    <circle cx="200" cy="150" r="38" fill="url(#ring1)" opacity="0.85" filter="url(#blur2)"/>
    <circle cx="200" cy="150" r="22" fill="white" opacity="0.15"/>
    <circle cx="192" cy="143" r="8" fill="white" opacity="0.4"/>

    {/* Floating dots */}
    <circle cx="100" cy="80" r="5" fill="#f953c6" opacity="0.7">
      <animate attributeName="cy" values="80;65;80" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="320" cy="200" r="4" fill="#3bc4f2" opacity="0.6">
      <animate attributeName="cy" values="200;185;200" dur="4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="150" cy="260" r="6" fill="#00e5a0" opacity="0.5">
      <animate attributeName="cy" values="260;245;260" dur="3.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="340" cy="100" r="3" fill="#6c63ff" opacity="0.8">
      <animate attributeName="cy" values="100;88;100" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="60" cy="160" r="4" fill="#ffd60a" opacity="0.6">
      <animate attributeName="cy" values="160;148;160" dur="3.8s" repeatCount="indefinite"/>
    </circle>

    {/* Geometric accents */}
    <polygon points="280,230 295,255 265,255" fill="#f953c6" opacity="0.3">
      <animateTransform attributeName="transform" type="rotate" from="0 280 243" to="360 280 243" dur="8s" repeatCount="indefinite"/>
    </polygon>
    <rect x="55" y="100" width="16" height="16" rx="3" fill="#3bc4f2" opacity="0.3" transform="rotate(20 63 108)">
      <animateTransform attributeName="transform" type="rotate" from="20 63 108" to="380 63 108" dur="10s" repeatCount="indefinite"/>
    </rect>
    <polygon points="350,160 360,178 340,178" fill="#00e5a0" opacity="0.4">
      <animateTransform attributeName="transform" type="rotate" from="0 350 170" to="360 350 170" dur="12s" repeatCount="indefinite"/>
    </polygon>

    {/* Habit streak lines (abstract) */}
    <path d="M 50 290 Q 120 260 200 275 Q 280 290 350 265" stroke="url(#ring2)" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
    <path d="M 50 300 Q 130 275 200 285 Q 270 295 350 278" stroke="url(#ring1)" strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round" strokeDasharray="6 4"/>
  </svg>
);

export const RegisterIllustration = () => (
  <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#3bc4f2" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="rg2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#f953c6" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="rring1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00e5a0"/>
        <stop offset="100%" stopColor="#3bc4f2"/>
      </linearGradient>
      <linearGradient id="rring2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6c63ff"/>
        <stop offset="100%" stopColor="#f953c6"/>
      </linearGradient>
      <filter id="rblur"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>

    <ellipse cx="120" cy="100" rx="120" ry="100" fill="url(#rg1)" filter="url(#rblur)" opacity="0.9"/>
    <ellipse cx="310" cy="220" rx="100" ry="90" fill="url(#rg2)" filter="url(#rblur)" opacity="0.8"/>

    {/* DNA-like spiral paths */}
    <path d="M 80 40 C 160 80 240 40 320 80 C 400 120 320 160 240 200 C 160 240 80 200 80 240" stroke="url(#rring1)" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round">
      <animate attributeName="stroke-dashoffset" from="0" to="600" dur="6s" repeatCount="indefinite"/>
      <animate attributeName="stroke-dasharray" values="10 5;15 3;10 5" dur="3s" repeatCount="indefinite"/>
    </path>
    <path d="M 320 40 C 240 80 160 40 80 80 C 0 120 80 160 160 200 C 240 240 320 200 320 240" stroke="url(#rring2)" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round">
      <animate attributeName="stroke-dashoffset" from="600" to="0" dur="6s" repeatCount="indefinite"/>
      <animate attributeName="stroke-dasharray" values="8 6;12 4;8 6" dur="4s" repeatCount="indefinite"/>
    </path>

    {/* Center starburst */}
    <circle cx="200" cy="150" r="42" fill="url(#rring1)" opacity="0.7" filter="url(#rblur)"/>
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <line key={i}
        x1={200 + Math.cos(angle * Math.PI/180) * 25}
        y1={150 + Math.sin(angle * Math.PI/180) * 25}
        x2={200 + Math.cos(angle * Math.PI/180) * 48}
        y2={150 + Math.sin(angle * Math.PI/180) * 48}
        stroke="url(#rring1)" strokeWidth="2" opacity="0.5" strokeLinecap="round"
      />
    ))}
    <circle cx="200" cy="150" r="18" fill="white" opacity="0.15"/>
    <circle cx="194" cy="144" r="7" fill="white" opacity="0.5"/>

    {/* Orbiting particles */}
    {[0,72,144,216,288].map((angle, i) => (
      <circle key={i} r="4"
        fill={['#00e5a0','#3bc4f2','#6c63ff','#f953c6','#ffd60a'][i]}
        opacity="0.8">
        <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite">
          <mpath href={`#orbit${i}`}/>
        </animateMotion>
      </circle>
    ))}
    <ellipse id="orbit0" cx="200" cy="150" rx="75" ry="40" fill="none"/>
    <ellipse id="orbit1" cx="200" cy="150" rx="90" ry="30" fill="none" transform="rotate(30 200 150)"/>
  </svg>
);

export const EmptyHabitsIllustration = () => (
  <svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 280, height: 'auto' }}>
    <defs>
      <linearGradient id="eg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f953c6"/>
        <stop offset="50%" stopColor="#6c63ff"/>
        <stop offset="100%" stopColor="#3bc4f2"/>
      </linearGradient>
      <filter id="eblur"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>

    {/* Glow background */}
    <ellipse cx="150" cy="110" rx="100" ry="80" fill="#6c63ff" opacity="0.08" filter="url(#eblur)"/>

    {/* Plant pot */}
    <path d="M 110 160 L 100 200 L 200 200 L 190 160 Z" fill="url(#eg1)" opacity="0.7" rx="4"/>
    <rect x="95" y="155" width="110" height="12" rx="6" fill="url(#eg1)" opacity="0.8"/>

    {/* Soil */}
    <ellipse cx="150" cy="161" rx="50" ry="6" fill="#1a1a2e" opacity="0.8"/>

    {/* Stem */}
    <path d="M 150 155 Q 148 120 150 90" stroke="#00e5a0" strokeWidth="3" strokeLinecap="round" fill="none"/>

    {/* Leaves */}
    <path d="M 148 130 Q 110 115 105 85 Q 130 95 148 120" fill="#00e5a0" opacity="0.9"/>
    <path d="M 152 115 Q 190 100 195 70 Q 170 80 152 108" fill="#3bc4f2" opacity="0.8"/>
    <path d="M 149 100 Q 120 82 118 58 Q 138 72 150 95" fill="#6c63ff" opacity="0.7"/>

    {/* Sparkles around plant */}
    {[[60,60],[240,80],[70,150],[245,140],[150,30]].map(([x,y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="2.5" fill={['#f953c6','#ffd60a','#3bc4f2','#00e5a0','#6c63ff'][i]} opacity="0.8">
          <animate attributeName="r" values="2.5;4;2.5" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite"/>
        </circle>
        <line x1={x} y1={y-5} x2={x} y2={y+5} stroke={['#f953c6','#ffd60a','#3bc4f2','#00e5a0','#6c63ff'][i]} strokeWidth="1.5" opacity="0.6"/>
        <line x1={x-5} y1={y} x2={x+5} y2={y} stroke={['#f953c6','#ffd60a','#3bc4f2','#00e5a0','#6c63ff'][i]} strokeWidth="1.5" opacity="0.6"/>
      </g>
    ))}

    {/* Floating dots */}
    <circle cx="80" cy="100" r="3" fill="#f953c6" opacity="0.5">
      <animate attributeName="cy" values="100;88;100" dur="2.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="220" cy="120" r="4" fill="#ffd60a" opacity="0.4">
      <animate attributeName="cy" values="120;108;120" dur="3.2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const DashboardHeroIllustration = () => (
  <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.9 }}>
    <defs>
      <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f953c6" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#6c63ff" stopOpacity="0.2"/>
      </linearGradient>
      <linearGradient id="dg2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3bc4f2" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#00e5a0" stopOpacity="0.2"/>
      </linearGradient>
      <filter id="dblur"><feGaussianBlur stdDeviation="8"/></filter>
    </defs>

    {/* Background glows */}
    <circle cx="150" cy="40" r="60" fill="url(#dg1)" filter="url(#dblur)"/>
    <circle cx="50" cy="100" r="50" fill="url(#dg2)" filter="url(#dblur)"/>

    {/* Abstract chart bars */}
    {[
      { x: 20, h: 40, color: '#6c63ff', delay: '0s' },
      { x: 44, h: 65, color: '#f953c6', delay: '0.1s' },
      { x: 68, h: 50, color: '#3bc4f2', delay: '0.2s' },
      { x: 92, h: 80, color: '#00e5a0', delay: '0.3s' },
      { x: 116, h: 55, color: '#ffd60a', delay: '0.4s' },
      { x: 140, h: 90, color: '#f953c6', delay: '0.5s' },
      { x: 164, h: 70, color: '#6c63ff', delay: '0.6s' },
    ].map((bar, i) => (
      <rect key={i} x={bar.x} y={120 - bar.h} width="18" height={bar.h} rx="6" fill={bar.color} opacity="0.7">
        <animate attributeName="height" values={`0;${bar.h};${bar.h}`} dur="1.2s" begin={bar.delay} fill="freeze"/>
        <animate attributeName="y" values={`120;${120 - bar.h};${120 - bar.h}`} dur="1.2s" begin={bar.delay} fill="freeze"/>
        <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3s" repeatCount="indefinite"/>
      </rect>
    ))}

    {/* Trend line */}
    <polyline
      points="29,90 53,68 77,78 101,48 125,62 149,36 173,52"
      stroke="white" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="200" strokeDashoffset="200">
      <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1.5s" begin="0.5s" fill="freeze"/>
    </polyline>

    {/* Dots on trend line */}
    {[[29,90],[53,68],[77,78],[101,48],[125,62],[149,36],[173,52]].map(([x,y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="white" opacity="0.8">
        <animate attributeName="r" values="0;3;3" dur="0.3s" begin={`${0.5 + i * 0.15}s`} fill="freeze"/>
      </circle>
    ))}

    {/* Floating rings */}
    <circle cx="175" cy="25" r="12" stroke="#f953c6" strokeWidth="1.5" fill="none" opacity="0.5">
      <animateTransform attributeName="transform" type="rotate" from="0 175 25" to="360 175 25" dur="8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="20" cy="30" r="8" stroke="#3bc4f2" strokeWidth="1" fill="none" opacity="0.4" strokeDasharray="4 3">
      <animateTransform attributeName="transform" type="rotate" from="360 20 30" to="0 20 30" dur="6s" repeatCount="indefinite"/>
    </circle>
  </svg>
);
