import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  MapPin,
  Clock,
  Share2,
  Flag,
  Navigation,
  CreditCard,
  Zap,
} from 'lucide-react';
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

const RATE_PER_HOUR = 2.5;

function formatElapsed(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatEstTotal(totalSeconds) {
  const hours = totalSeconds / 3600;
  return `S$${(hours * RATE_PER_HOUR).toFixed(2)}`;
}

export default function CheckInScreen() {
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const [timeIn] = useState(() =>
    new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const estTotal = formatEstTotal(elapsed);

  const detailRows = [
    { label: 'Carpark', value: DEMO_CARPARK_FULL_NAME, valueColor: BRAND_DARK },
    { label: 'Spot', value: DEMO_SPOT_LABEL, valueColor: BRAND_ORANGE },
    { label: 'Level', value: 'Basement 1', valueColor: BRAND_DARK },
    { label: 'Time In', value: timeIn, valueColor: BRAND_DARK },
    { label: 'Rate', value: 'S$2.50 / hr', valueColor: BRAND_DARK },
    { label: 'Est. Total', value: estTotal, valueColor: BRAND_BLUE },
  ];

  return (
    <motion.div
      {...screenPageTransition}
      style={{
        backgroundColor: '#F4F6F8',
        display: 'flex', flexDirection: 'column',
        minHeight: 'calc(100svh - var(--header-h))',
      }}
    >

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Header */}
        <header style={{
          backgroundColor: '#fff',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderBottom: '1px solid #F0F2F5',
        }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: BRAND_DARK }}>My Parking</span>
        </header>

        {/* Arrived card */}
        <div style={{
          backgroundColor: '#fff',
          margin: '14px 16px',
          borderRadius: '20px',
          padding: '24px 20px',
          textAlign: 'center',
          boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
          border: '1px solid #F0F2F5',
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 16, mass: 0.8 }}
            style={{
              width: '64px', height: '64px',
              background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 16px rgba(22,163,74,0.2)',
            }}
          >
            <CheckCircle size={32} color="#16A34A" strokeWidth={2.5} />
          </motion.div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: BRAND_DARK }}>
            You've Arrived!
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '6px' }}>
            {`Welcome to ${DEMO_CARPARK_FULL_NAME}`}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            backgroundColor: '#EEF2FA', borderRadius: '20px',
            padding: '5px 12px', marginTop: '12px',
          }}>
            <Zap size={12} color={BRAND_BLUE} fill={BRAND_BLUE} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: BRAND_BLUE }}>
              Premium Cashback Active
            </span>
          </div>
        </div>

        {/* Session details card */}
        <div style={{
          backgroundColor: '#fff',
          margin: '0 16px',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
          border: '1px solid #F0F2F5',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: '700', color: '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px',
          }}>Parking Session</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {detailRows.map(({ label, value, valueColor }) => (
              <div key={label}>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '3px', fontWeight: '500' }}>{label}</div>
                <div style={{
                  fontSize: '13px', fontWeight: '700', color: valueColor,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #F0F2F5', margin: '16px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px', height: '38px', flexShrink: 0,
              background: `linear-gradient(135deg, ${BRAND_BLUE}20, ${BRAND_BLUE}10)`,
              border: `1px solid ${BRAND_BLUE}30`,
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={18} color={BRAND_BLUE} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: BRAND_DARK }}>{`Spot ${DEMO_SPOT_LABEL} saved`}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                We'll navigate you back when ready
              </div>
            </div>
          </div>
        </div>

        {/* Live timer card */}
        <div style={{
          backgroundColor: '#fff',
          margin: '14px 16px',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
          border: '1px solid #F0F2F5',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: BRAND_DARK }}>Parking Timer</span>
            <span style={{
              backgroundColor: '#DCFCE7', color: '#16A34A',
              fontSize: '10px', fontWeight: '700',
              padding: '3px 8px', borderRadius: '20px',
              letterSpacing: '0.5px',
              animation: 'carpals-pulse 1.6s ease-in-out infinite',
            }}>● LIVE</span>
          </div>

          <div style={{
            textAlign: 'center', margin: '4px 0 12px',
            fontSize: '42px', fontWeight: '800', color: BRAND_DARK,
            letterSpacing: '3px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Mono", ui-monospace, monospace',
          }}>
            {formatElapsed(elapsed)}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '10px 14px',
          }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>S$2.50 / hr</span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: BRAND_BLUE }}>
              Est. {estTotal}
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px', margin: '0 16px',
        }}>
          {[
            { Icon: Clock,      color: BRAND_BLUE,   bg: '#EEF2FA', label: 'Extend' },
            { Icon: Share2,     color: BRAND_BLUE,   bg: '#EEF2FA', label: 'Share' },
            { Icon: Flag,       color: '#EF4444',    bg: '#FEE2E2', label: 'Report' },
            { Icon: Navigation, color: BRAND_ORANGE, bg: '#FEF0EA', label: 'Directions' },
          ].map(({ Icon, color, bg, label }) => (
            <div
              key={label}
              style={{
                backgroundColor: '#fff', borderRadius: '14px',
                padding: '12px 8px', textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                border: '1px solid #F0F2F5',
              }}
            >
              <div style={{
                width: '36px', height: '36px',
                backgroundColor: bg, borderRadius: '10px',
                margin: '0 auto 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color={color} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '600' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Pay button */}
        <div style={{ padding: '16px 16px 24px' }}>
          <button
            type="button"
            onClick={() => navigate('/payment')}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #d4561f 100%)`,
              color: '#fff',
              borderRadius: '16px', padding: '17px',
              fontSize: '15px', fontWeight: '800',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 24px rgba(236,100,51,0.4)',
              letterSpacing: '0.2px',
            }}
          >
            <CreditCard size={18} strokeWidth={2.5} />
            Complete Parking & Pay
          </button>
        </div>
      </div>
    </motion.div>
  );
}
