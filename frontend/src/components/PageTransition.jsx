import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('enter');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('exit');
      const t = setTimeout(() => {
        setDisplayLocation(location);
        setStage('enter');
      }, 220);
      return () => clearTimeout(t);
    }
  }, [location]);

  return (
    <div
      style={{
        opacity: stage === 'exit' ? 0 : 1,
        transform: stage === 'exit' ? 'translateY(10px)' : 'translateY(0)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        width: '100%',
      }}
      key={displayLocation.pathname}
    >
      {children}
    </div>
  );
}
