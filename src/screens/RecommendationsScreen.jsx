import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, SlidersHorizontal,
  Sparkles, Clock, Car,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DEMO_CARPARK_FULL_NAME } from '../demoSession';
import { screenPageTransition } from '../pageTransition';

const BRAND_BLUE = '#365486';
const BRAND_ORANGE = '#ec6433';
const BRAND_DARK = '#0D1B3E';

const StatusBar = () => (
  <div style={{
    height: '44px', backgroundColor: BRAND_DARK,
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0 20px', flexShrink: 0,
  }}>
    <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>9:41 AM</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
        {[5, 8, 11, 14].map((h, i) => (
          <div key={i} style={{ width: '3px', height: `${h}px`, backgroundColor: '#fff', borderRadius: '1px' }} />
        ))}
      </div>
      <div style={{ position: 'relative', width: '22px', height: '11px', border: '1.5px solid #fff', borderRadius: '2px', marginLeft: '2px' }}>
        <div style={{ position: 'absolute', right: '-4px', top: '50%', transform: 'translateY(-50%)', width: '2px', height: '5px', backgroundColor: '#fff', borderRadius: '1px' }} />
        <div style={{ position: 'absolute', left: '2px', top: '1.5px', bottom: '1.5px', width: '13px', backgroundColor: '#fff', borderRadius: '1px' }} />
      </div>
    </div>
  </div>
);

const SORT_TABS = ['Recommended', 'Price', 'Distance', 'Availability'];

const CARDS = [
  {
    id: 1,
    rank: '#1', rankBg: '#FFF4E6', rankColor: BRAND_ORANGE,
    isTopPick: true,
    name: DEMO_CARPARK_FULL_NAME,
    address: '1 Raffles Place, Singapore',
    walk: '3 min walk', eta: '4 min ETA', price: 'S$2.50/hr',
    spaces: '47 spaces', pct: '31%', fill: '31%', fillColor: BRAND_BLUE,
    tags: ['Cheapest nearby', 'Covered', '5 min saved'],
    borderColor: BRAND_ORANGE,
    topColor: BRAND_ORANGE,
  },
  {
    id: 2,
    rank: '#2', rankBg: '#F1F5F9', rankColor: '#64748B',
    isTopPick: false,
    name: 'Marina Bay Car Park',
    address: '10 Bayfront Ave, Singapore',
    walk: '5 min walk', eta: '6 min ETA', price: 'S$3.00/hr',
    spaces: '23 spaces', pct: '88%', fill: '88%', fillColor: '#EF4444',
    tags: ['Best views', 'EV charging'],
    borderColor: '#E5E7EB',
    topColor: '#EF4444',
    spacesBadgeBg: '#FEE2E2', spacesBadgeColor: '#DC2626', spacesBadgeText: 'Almost full',
  },
  {
    id: 3,
    rank: '#3', rankBg: '#F1F5F9', rankColor: '#64748B',
    isTopPick: false,
    name: 'Tanjong Pagar Plaza',
    address: '7 Tanjong Pagar Plaza, Singapore',
    walk: '8 min walk', eta: '9 min ETA', price: 'S$1.80/hr',
    spaces: '120 spaces', pct: '40%', fill: '40%', fillColor: '#16A34A',
    tags: ['Most available', 'Budget friendly'],
    borderColor: '#E5E7EB',
    topColor: '#16A34A',
    spacesBadgeBg: '#DCFCE7', spacesBadgeColor: '#16A34A', spacesBadgeText: 'Available',
  },
];

export default function RecommendationsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Recommended');

  return (
    <motion.div
      {...screenPageTransition}
      style={{
        backgroundColor: '#F4F6F8',
        display: 'flex', flexDirection: 'column',
        minHeight: 'calc(100svh - var(--header-h))',
      }}
    >

      {/* Top bar */}
      <div style={{
        backgroundColor: '#fff', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
        borderBottom: '1px solid #F0F2F5', flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', padding: '6px',
            cursor: 'pointer', borderRadius: '8px',
            display: 'flex', alignItems: 'center',
            backgroundColor: '#F4F6F8', flexShrink: 0,
          }}
        >
          <ChevronLeft size={20} color={BRAND_DARK} strokeWidth={2.5} />
        </button>
        <div style={{
          flex: 1, backgroundColor: '#F4F6F8', borderRadius: '10px',
          padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '7px',
          minWidth: 0,
        }}>
          <MapPin size={14} color={BRAND_ORANGE} strokeWidth={2.5} />
          <span style={{
            fontSize: '13px', fontWeight: '600', color: BRAND_DARK,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{DEMO_CARPARK_FULL_NAME}</span>
        </div>
        <button style={{
          background: 'none', border: 'none', padding: '6px',
          cursor: 'pointer', borderRadius: '8px', backgroundColor: '#F4F6F8',
          display: 'flex', alignItems: 'center', flexShrink: 0,
        }}>
          <SlidersHorizontal size={18} color={BRAND_DARK} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>

        {/* AI Banner */}
        <div style={{
          margin: '12px 12px 8px',
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_BLUE} 100%)`,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '36px', height: '36px', flexShrink: 0,
            backgroundColor: 'rgba(236,100,51,0.2)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={20} color={BRAND_ORANGE} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>AI Smart Recommendation</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>
              Analysed 47 carparks · Best for your arrival time
            </div>
          </div>
          <div style={{
            backgroundColor: BRAND_ORANGE, borderRadius: '20px',
            padding: '4px 10px', flexShrink: 0,
          }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#fff' }}>LIVE</span>
          </div>
        </div>

        {/* Sort tabs — horizontally scrollable, no overflow */}
        <div
          className="no-scrollbar"
          style={{
            padding: '4px 12px 8px',
            display: 'flex', gap: '6px',
            overflowX: 'auto',
            flexWrap: 'nowrap',
          }}
        >
          {SORT_TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  borderRadius: '20px', padding: '7px 14px',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  border: active ? 'none' : '1px solid #E5E7EB',
                  backgroundColor: active ? BRAND_BLUE : '#fff',
                  color: active ? '#fff' : '#6B7280',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CARDS.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: '#fff', borderRadius: '18px',
                border: `1.5px solid ${c.isTopPick ? BRAND_ORANGE : '#F0F2F5'}`,
                padding: '16px',
                boxShadow: c.isTopPick
                  ? '0 4px 20px rgba(236,100,51,0.12)'
                  : '0 2px 10px rgba(0,0,0,0.05)',
                overflow: 'hidden',
              }}
            >
              {/* Top row — rank + badge */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '10px',
              }}>
                <span style={{
                  fontSize: '11px', fontWeight: '800',
                  padding: '3px 8px', borderRadius: '20px',
                  backgroundColor: c.rankBg, color: c.rankColor,
                  letterSpacing: '0.3px',
                }}>{c.rank}</span>

                {c.isTopPick ? (
                  <span style={{
                    fontSize: '11px', fontWeight: '700',
                    padding: '3px 10px', borderRadius: '20px',
                    background: `linear-gradient(135deg, ${BRAND_ORANGE}, #d4561f)`,
                    color: '#fff',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Sparkles size={11} />
                    AI Top Pick
                  </span>
                ) : (
                  <span style={{
                    fontSize: '11px', fontWeight: '600',
                    padding: '3px 10px', borderRadius: '20px',
                    backgroundColor: c.spacesBadgeBg, color: c.spacesBadgeColor,
                  }}>{c.spacesBadgeText}</span>
                )}
              </div>

              {/* Name + address */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: BRAND_DARK }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{c.address}</div>
              </div>

              {/* Stats row */}
              <div style={{
                display: 'flex', gap: '6px', marginBottom: '12px',
                flexWrap: 'nowrap', overflow: 'hidden',
              }}>
                {[
                  { Icon: MapPin, text: c.walk },
                  { Icon: Clock,  text: c.eta },
                  { Icon: Car,    text: c.price },
                ].map(({ Icon, text }) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    backgroundColor: '#F8FAFC', borderRadius: '8px',
                    padding: '5px 8px', flexShrink: 0,
                  }}>
                    <Icon size={12} color={BRAND_BLUE} strokeWidth={2.5} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Availability bar */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: BRAND_DARK }}>{c.spaces} available</span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.pct} full</span>
                </div>
                <div style={{ height: '5px', backgroundColor: '#F0F2F5', borderRadius: '10px' }}>
                  <div style={{
                    width: c.fill, height: '100%',
                    backgroundColor: c.fillColor,
                    borderRadius: '10px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              {/* AI tags */}
              <div style={{
                display: 'flex', gap: '6px', flexWrap: 'wrap',
                marginBottom: '14px',
              }}>
                {c.tags.map((tag) => (
                  <span key={tag} style={{
                    backgroundColor: '#EEF2FA', color: BRAND_BLUE,
                    fontSize: '11px', padding: '4px 10px',
                    borderRadius: '20px', fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}>{tag}</span>
                ))}
              </div>

              {/* Select button */}
              <button
                onClick={() => navigate(`/carpark/${c.id}`)}
                style={{
                  width: '100%',
                  background: c.isTopPick
                    ? `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #d4561f 100%)`
                    : BRAND_BLUE,
                  color: '#fff',
                  borderRadius: '12px', padding: '13px',
                  fontSize: '14px', fontWeight: '700',
                  border: 'none', cursor: 'pointer',
                  letterSpacing: '0.2px',
                  boxShadow: c.isTopPick
                    ? '0 4px 14px rgba(236,100,51,0.35)'
                    : '0 4px 14px rgba(54,84,134,0.25)',
                }}
              >
                Select This Carpark →
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
