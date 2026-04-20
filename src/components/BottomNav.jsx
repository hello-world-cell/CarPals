import { useLocation, useNavigate } from 'react-router-dom';
import { House, Search, Car, User } from 'lucide-react';

const BRAND_BLUE = '#365486';
const INACTIVE = '#9CA3AF';

const NAV_ITEMS = [
  {
    label: 'Home',
    icon: House,
    path: '/recommendations',
    isActive: (p) => p === '/recommendations' || p.startsWith('/carpark'),
  },
  {
    label: 'Search',
    icon: Search,
    path: '/',
    isActive: (p) => p === '/',
  },
  {
    label: 'My Parking',
    icon: Car,
    path: '/checkin',
    isActive: (p) => p === '/navigate' || p === '/checkin' || p === '/payment',
  },
  {
    label: 'Profile',
    icon: User,
    path: '/recommendations',
    isActive: () => false,
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  if (pathname === '/') return null;

  return (
    <div
      className="bottom-nav"
      style={{
        height: 'var(--bottom-nav-h)',
        boxSizing: 'border-box',
        paddingLeft: 'max(8px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(8px, env(safe-area-inset-right, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: '#fff',
        borderTop: '1px solid #F0F2F5',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
      }}
    >
      {NAV_ITEMS.map(({ label, icon: Icon, path, isActive }) => {
        const active = isActive(pathname);
        return (
          <button
            key={label}
            type="button"
            onClick={() => navigate(path)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '3px',
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px 12px',
              position: 'relative',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute', top: '-1px',
                width: '32px', height: '3px',
                backgroundColor: '#ec6433',
                borderRadius: '0 0 3px 3px',
              }} />
            )}
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              backgroundColor: active ? '#EEF2FA' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.15s',
            }}>
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.8}
                color={active ? BRAND_BLUE : INACTIVE}
              />
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: active ? '700' : '400',
              color: active ? BRAND_BLUE : INACTIVE,
              letterSpacing: active ? '0.1px' : '0',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
