import { useNavigate, useLocation } from 'react-router-dom';

const BRAND_BLUE = '#365486';
const BRAND_ORANGE = '#ec6433';

const NAV_LINKS = [
  { label: 'Home',       path: '/recommendations', matches: (p) => p === '/recommendations' || p.startsWith('/carpark') },
  { label: 'Search',     path: '/',                matches: (p) => p === '/' },
  { label: 'My Parking', path: '/checkin',         matches: (p) => p === '/navigate' || p === '/checkin' || p === '/payment' },
  { label: 'Profile',    path: '/recommendations', matches: () => false },
];

export default function AppHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--header-h)',
      backgroundColor: BRAND_BLUE,
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      zIndex: 300,
      boxShadow: '0 2px 12px rgba(13,27,62,0.25)',
    }}>
      {/* Logo + wordmark */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 0,
        }}
      >
        <div style={{
          width: '34px', height: '34px',
          background: `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #d4561f 100%)`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(236,100,51,0.35)',
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.5px' }}>P</span>
        </div>
        <span style={{ color: '#fff', fontSize: '17px', fontWeight: '700', letterSpacing: '-0.3px' }}>
          Carpark<span style={{ color: BRAND_ORANGE }}>Pals</span>
        </span>
      </button>

      <div style={{ flex: 1 }} />

      {/* Desktop nav links */}
      <nav className="header-nav-links" style={{ alignItems: 'center', gap: '4px' }}>
        {NAV_LINKS.map(({ label, path, matches }) => {
          const active = matches(pathname);
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              style={{
                background: active ? 'rgba(255,255,255,0.18)' : 'none',
                border: 'none', cursor: 'pointer',
                color: active ? '#fff' : 'rgba(255,255,255,0.72)',
                fontSize: '14px', fontWeight: active ? '600' : '400',
                padding: '7px 14px', borderRadius: '8px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
              onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'none')}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
