import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

function progressPercent(pathname) {
  if (pathname === '/') return 0;
  if (pathname === '/recommendations') return 20;
  if (pathname.startsWith('/carpark')) return 40;
  if (pathname === '/navigate') return 60;
  if (pathname === '/checkin') return 80;
  if (pathname === '/payment') return 100;
  return 0;
}

export default function RouteProgress() {
  const { pathname } = useLocation();
  const pct = useMemo(() => progressPercent(pathname), [pathname]);

  if (pct === 0) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 'var(--header-h)',
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: '#E5E7EB',
        zIndex: 290,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #365486 0%, #ec6433 100%)',
          transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  );
}
