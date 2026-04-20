import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Heart, MapPin, Clock, Car, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { DEMO_CARPARK_FULL_NAME, DEMO_SPOT_LABEL } from '../demoSession';
import { screenPageTransition } from '../pageTransition';

const BRAND_BLUE = '#365486';
const BRAND_ORANGE = '#ec6433';
const BRAND_DARK = '#0D1B3E';

const StatusBar = () => (
  <div style={{
    height: '44px', backgroundColor: BRAND_DARK, flexShrink: 0,
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0 20px',
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

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = 6;
const FLOORS = ['B1', 'B2', 'B3'];

function spotStatus(rowIdx, colIdx, section, floorSeed) {
  if (rowIdx === 0 && colIdx === 4 && section === 1) return 'recommended';
  const h = ((rowIdx * 13 + colIdx * 7 + section * 5 + floorSeed) * 1103515245 + 12345) & 0x7fffffff;
  const v = h % 20;
  if (v < 12) return 'available';
  if (v < 19) return 'occupied';
  return 'reserved';
}

const SPOT_STYLE = {
  available:   { bg: '#DCFCE7', border: '1px solid #86EFAC' },
  occupied:    { bg: '#FEE2E2', border: '1px solid #FCA5A5' },
  reserved:    { bg: '#DBEAFE', border: '1px solid #93C5FD' },
  recommended: { bg: '#FFF4E6', border: `2px solid ${BRAND_ORANGE}` },
};

function Spot({ status }) {
  const s = SPOT_STYLE[status];
  const base = {
    width: '22px', height: '32px', borderRadius: '4px',
    backgroundColor: s.bg, border: s.border,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };
  if (status === 'recommended') {
    return (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        style={base}
      >
        <span style={{ fontSize: '11px', color: BRAND_ORANGE, lineHeight: 1 }}>★</span>
      </motion.div>
    );
  }
  return <div style={base} />;
}

function ParkingGrid({ activeFloor }) {
  const seed = activeFloor.charCodeAt(1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {/* Left section */}
      <div>
        {ROWS.map((row, rowIdx) => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '3px' }}>
            <span style={{ width: '14px', fontSize: '10px', color: '#9CA3AF', textAlign: 'center', flexShrink: 0, fontWeight: '600' }}>{row}</span>
            {Array.from({ length: COLS }).map((_, colIdx) => (
              <Spot key={colIdx} status={spotStatus(rowIdx, colIdx, 0, seed)} />
            ))}
          </div>
        ))}
      </div>

      {/* Driving lane */}
      <div style={{
        width: '12px', alignSelf: 'stretch',
        backgroundColor: '#E5E7EB',
        borderRadius: '4px', margin: '0 5px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '2px', height: '80%', backgroundColor: '#fff', borderRadius: '1px' }} />
      </div>

      {/* Right section */}
      <div>
        {ROWS.map((row, rowIdx) => (
          <div key={row} style={{ display: 'flex', gap: '2px', marginBottom: '3px' }}>
            {Array.from({ length: COLS }).map((_, colIdx) => (
              <Spot key={colIdx} status={spotStatus(rowIdx, colIdx, 1, seed)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const CARPARK_OTHER = {
  2: { name: 'Marina Bay Car Park', spot: 'B2 · C-11' },
  3: { name: 'Tanjong Pagar Plaza', spot: 'B1 · D-08' },
};

export default function CarParkDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState('Floor Map');
  const [activeFloor, setFloor] = useState('B1');

  const { carparkName, spotLabel } = useMemo(() => {
    const key = Number.parseInt(String(id ?? '1'), 10) || 1;
    if (key === 1) return { carparkName: DEMO_CARPARK_FULL_NAME, spotLabel: DEMO_SPOT_LABEL };
    const o = CARPARK_OTHER[key];
    if (o) return { carparkName: o.name, spotLabel: o.spot };
    return { carparkName: DEMO_CARPARK_FULL_NAME, spotLabel: DEMO_SPOT_LABEL };
  }, [id]);

  const legendItems = useMemo(() => [
    { bg: '#DCFCE7', border: '#86EFAC', label: 'Available' },
    { bg: '#FEE2E2', border: '#FCA5A5', label: 'Occupied' },
    { bg: '#DBEAFE', border: '#93C5FD', label: 'Reserved' },
    { bg: '#FFF4E6', border: BRAND_ORANGE, label: `Your spot` },
  ], []);

  return (
    <motion.div
      {...screenPageTransition}
      className="screen-fixed"
      style={{ backgroundColor: '#fff' }}
    >

      {/* Header */}
      <div style={{
        padding: '10px 16px', backgroundColor: '#fff', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #F0F2F5',
      }}>
        <button
          onClick={() => navigate('/recommendations')}
          style={{
            background: 'none', border: 'none', padding: '6px',
            cursor: 'pointer', borderRadius: '8px', backgroundColor: '#F4F6F8',
            display: 'flex', alignItems: 'center',
          }}
        >
          <ChevronLeft size={20} color={BRAND_DARK} strokeWidth={2.5} />
        </button>
        <span style={{
          fontSize: '15px', fontWeight: '700', color: BRAND_DARK,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: '200px',
        }}>{carparkName}</span>
        <button style={{
          background: 'none', border: 'none', padding: '6px',
          cursor: 'pointer', borderRadius: '8px',
          display: 'flex', alignItems: 'center',
        }}>
          <Heart size={20} color="#9CA3AF" />
        </button>
      </div>

      {/* Quick stats */}
      <div style={{
        backgroundColor: '#F8FAFC', padding: '14px 20px', flexShrink: 0,
        display: 'flex', justifyContent: 'space-around',
        borderBottom: '1px solid #F0F2F5',
      }}>
        {[
          { value: '4.8', label: 'Rating', icon: '⭐' },
          { value: '3 min', label: 'Walk time' },
          { value: 'S$2.50', label: 'Per hour' },
        ].map(({ value, label, icon }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: BRAND_DARK }}>
              {icon}{value}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', fontWeight: '500' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '2px solid #F0F2F5',
        padding: '0 16px', flexShrink: 0, backgroundColor: '#fff',
      }}>
        {['Floor Map', 'Details', 'Reviews'].map((t) => {
          const active = t === tab;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 16px', fontSize: '13px', cursor: 'pointer',
              border: 'none', background: 'transparent',
              fontWeight: active ? '700' : '500',
              color: active ? BRAND_BLUE : '#9CA3AF',
              borderBottom: active ? `2px solid ${BRAND_BLUE}` : '2px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.15s',
            }}>{t}</button>
          );
        })}
      </div>

      {/* Scrollable tab content */}
      <div className="no-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {tab === 'Floor Map' && (
          <div style={{ padding: '16px' }}>
            {/* Floor selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {FLOORS.map((f) => (
                <button key={f} onClick={() => setFloor(f)} style={{
                  borderRadius: '10px', padding: '9px 20px',
                  fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  border: 'none',
                  backgroundColor: f === activeFloor ? BRAND_BLUE : '#F4F6F8',
                  color: f === activeFloor ? '#fff' : '#6B7280',
                  transition: 'all 0.15s',
                  boxShadow: f === activeFloor ? '0 4px 12px rgba(54,84,134,0.3)' : 'none',
                }}>{f}</button>
              ))}
            </div>

            {/* Floor plan box */}
            <div style={{
              backgroundColor: '#F8FAFC', borderRadius: '16px',
              padding: '16px', border: '1px solid #E5E7EB',
            }}>
              <div style={{
                fontSize: '12px', color: '#6B7280', marginBottom: '12px',
                fontWeight: '600',
              }}>
                Basement {activeFloor.slice(1)} · 47 spaces available
              </div>

              <div style={{ overflowX: 'auto' }} className="no-scrollbar">
                <ParkingGrid activeFloor={activeFloor} />
              </div>

              {/* Entry/Exit */}
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{
                  fontSize: '11px', color: '#9CA3AF',
                  backgroundColor: '#E5E7EB',
                  padding: '4px 16px', borderRadius: '4px',
                  fontWeight: '600', letterSpacing: '0.3px',
                }}>▼ ENTRY / EXIT</span>
              </div>

              {/* Legend */}
              <div style={{
                display: 'flex', gap: '8px', marginTop: '12px',
                flexWrap: 'wrap',
              }}>
                {legendItems.map(({ bg, border, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '2px',
                      backgroundColor: bg, border: `1px solid ${border}`,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '11px', color: '#6B7280', whiteSpace: 'nowrap' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Recommendation box */}
              <div style={{
                backgroundColor: '#FFF4E6', borderRadius: '12px',
                padding: '12px 14px', marginTop: '12px',
                border: `1px solid ${BRAND_ORANGE}30`,
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <div style={{
                  width: '32px', height: '32px', flexShrink: 0,
                  backgroundColor: `${BRAND_ORANGE}20`,
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Star size={16} color={BRAND_ORANGE} fill={BRAND_ORANGE} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: BRAND_DARK }}>
                    {`Spot ${spotLabel} recommended`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    Closest to Raffles Place MRT exit
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Details' && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏗️</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: BRAND_DARK, marginBottom: '6px' }}>Details Coming Soon</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Carpark amenities and facilities will appear here</div>
          </div>
        )}

        {tab === 'Reviews' && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭐</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: BRAND_DARK, marginBottom: '6px' }}>Reviews Coming Soon</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Driver reviews and ratings will appear here</div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{
        flexShrink: 0, zIndex: 20,
        padding: '14px 16px',
        borderTop: '1px solid #F0F2F5',
        display: 'flex', gap: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.07)',
      }}>
        <button
          onClick={() => navigate('/navigate')}
          style={{
            flex: 1, backgroundColor: '#fff',
            border: `2px solid ${BRAND_BLUE}`, color: BRAND_BLUE,
            borderRadius: '14px', padding: '14px',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          }}
        >Navigate</button>
        <button
          onClick={() => navigate('/navigate')}
          style={{
            flex: 2,
            background: `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #d4561f 100%)`,
            color: '#fff',
            borderRadius: '14px', padding: '14px',
            fontSize: '14px', fontWeight: '700',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(236,100,51,0.4)',
          }}
        >{`Reserve ${spotLabel}`}</button>
      </div>
    </motion.div>
  );
}
