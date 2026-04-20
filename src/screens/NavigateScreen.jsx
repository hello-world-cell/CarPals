import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation2, X, Clock, MapPin, Car, ArrowLeft, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_CARPARK_FULL_NAME, DEMO_SPOT_LABEL } from '../demoSession';
import { screenPageTransition } from '../pageTransition';

const BRAND_BLUE   = '#365486';
const BRAND_ORANGE = '#ec6433';
const BRAND_DARK   = '#0D1B3E';

/* ── Alert definitions ─────────────────────────────────────────────────────── */
const ALERTS = [
  { id: 'a1', icon: AlertTriangle, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', text: 'Traffic on Shenton Way · +2 min', delay: 3000,  duration: 4500 },
  { id: 'a2', icon: ArrowUpRight,  color: BRAND_BLUE, bg: '#EEF2FA', border: '#BFD0F0', text: 'Faster via Robinson Rd · Save 3 min', delay: 9000,  duration: 4000 },
  { id: 'a3', icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2', border: '#FCA5A5', text: 'F1 closure near Marina Bay · Minor',  delay: 15000, duration: 4500 },
];

/* ── Status bar ─────────────────────────────────────────────────────────────── */
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

/* ── Singapore CBD SVG Map ──────────────────────────────────────────────────── */
/*
 * Coordinate system (390 × 450 px viewBox):
 *   - Marina Bay water fills the lower-right quadrant
 *   - Singapore River runs W→E across the middle
 *   - User start: Tanjong Pagar area  (~130, 295)
 *   - Carpark dest: Raffles Place area (~228, 228)
 */
function SingaporeCBDMap() {
  return (
    <svg
      viewBox="0 0 390 450"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden
    >
      {/* ── Land background ──────────────────────────────────────────────────── */}
      <rect x="0" y="0" width="390" height="450" fill="#DDE4ED" />

      {/* ── Marina Bay water ─────────────────────────────────────────────────── */}
      <path
        d="M 0 370 Q 80 340 160 335 Q 220 332 280 338 Q 320 342 360 330 L 390 325 L 390 450 L 0 450 Z"
        fill="#4A90D9"
        opacity="0.85"
      />
      {/* Marina Bay inner ripple */}
      <path
        d="M 50 395 Q 140 380 240 382 Q 320 384 380 376"
        fill="none" stroke="#5BA4DF" strokeWidth="1.5" opacity="0.6"
      />
      <path
        d="M 30 415 Q 130 400 230 402 Q 310 403 385 394"
        fill="none" stroke="#5BA4DF" strokeWidth="1" opacity="0.4"
      />

      {/* ── Singapore River ───────────────────────────────────────────────────── */}
      <path
        d="M 0 268 Q 40 264 75 260 Q 105 257 130 252 Q 160 247 188 242 Q 210 238 228 238"
        fill="none" stroke="#4A90D9" strokeWidth="9" strokeLinecap="round"
        opacity="0.75"
      />
      {/* River highlight */}
      <path
        d="M 0 268 Q 40 264 75 260 Q 105 257 130 252 Q 160 247 188 242 Q 210 238 228 238"
        fill="none" stroke="#6AAEE0" strokeWidth="4" strokeLinecap="round"
        opacity="0.5"
      />

      {/* ── Green areas ───────────────────────────────────────────────────────── */}
      {/* Padang / Esplanade area */}
      <rect x="250" y="188" width="60" height="35" rx="6" fill="#8ABF7A" opacity="0.65" />
      {/* Fort Canning */}
      <ellipse cx="128" cy="215" rx="28" ry="18" fill="#8ABF7A" opacity="0.55" />
      {/* Small park */}
      <rect x="60" y="288" width="22" height="18" rx="4" fill="#8ABF7A" opacity="0.5" />

      {/* ── Roads (major, white) ─────────────────────────────────────────────── */}
      {/* Shenton Way (E-W, south CBD) */}
      <line x1="75" y1="300" x2="270" y2="292" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      {/* Shenton Way centre line */}
      <line x1="75" y1="300" x2="270" y2="292" stroke="#E8ECF0" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 8" />

      {/* Raffles Quay (along waterfront, S of river) */}
      <path d="M 140 310 Q 190 305 245 302 Q 275 300 305 296" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />

      {/* Robinson Road (N-S) */}
      <line x1="204" y1="165" x2="212" y2="320" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <line x1="204" y1="165" x2="212" y2="320" stroke="#E8ECF0" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 8" />

      {/* Cecil Street / Cross Street (E-W, mid) */}
      <line x1="105" y1="264" x2="248" y2="260" stroke="#fff" strokeWidth="6" strokeLinecap="round" />

      {/* Church Street (E-W, upper) */}
      <line x1="155" y1="238" x2="248" y2="235" stroke="#fff" strokeWidth="5" strokeLinecap="round" />

      {/* Battery Road (short N-S, Raffles Place core) */}
      <line x1="228" y1="198" x2="232" y2="260" stroke="#fff" strokeWidth="5" strokeLinecap="round" />

      {/* North Bridge Road (N-S, rightside) */}
      <line x1="256" y1="145" x2="264" y2="310" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <line x1="256" y1="145" x2="264" y2="310" stroke="#E8ECF0" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 8" />

      {/* New Bridge Road (N-S, leftside) */}
      <line x1="118" y1="215" x2="122" y2="325" stroke="#fff" strokeWidth="6" strokeLinecap="round" />

      {/* Fullerton Road (curved, near river exit) */}
      <path d="M 210 258 Q 235 262 260 268 Q 280 272 295 278" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />

      {/* Marina Boulevard (E-W near waterfront) */}
      <line x1="148" y1="326" x2="350" y2="318" stroke="#fff" strokeWidth="8" strokeLinecap="round" />

      {/* Orchard Road (north) */}
      <line x1="0" y1="165" x2="195" y2="152" stroke="#fff" strokeWidth="7" strokeLinecap="round" />

      {/* Upper Pickering Street */}
      <line x1="110" y1="248" x2="175" y2="246" stroke="#fff" strokeWidth="4" strokeLinecap="round" />

      {/* Bras Basah Road */}
      <line x1="192" y1="180" x2="265" y2="193" stroke="#fff" strokeWidth="5" strokeLinecap="round" />

      {/* Eu Tong Sen Street */}
      <line x1="112" y1="260" x2="96" y2="325" stroke="#fff" strokeWidth="5" strokeLinecap="round" />

      {/* ── Roads (minor, lighter) ───────────────────────────────────────────── */}
      <line x1="165" y1="245" x2="172" y2="305" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
      <line x1="185" y1="245" x2="190" y2="310" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="240" y1="240" x2="244" y2="300" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
      <line x1="138" y1="260" x2="145" y2="308" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

      {/* ── Building blocks ───────────────────────────────────────────────────── */}
      {/* CBD core */}
      <rect x="215" y="200" width="36" height="28" rx="4" fill="#C0CAD8" />
      <rect x="170" y="202" width="28" height="24" rx="4" fill="#C0CAD8" />
      <rect x="220" y="262" width="30" height="22" rx="4" fill="#C0CAD8" />
      <rect x="168" y="263" width="24" height="20" rx="3" fill="#C0CAD8" />
      <rect x="140" y="265" width="22" height="18" rx="3" fill="#C8D2DC" />
      <rect x="135" y="218" width="26" height="22" rx="3" fill="#C8D2DC" />
      <rect x="270" y="210" width="42" height="32" rx="5" fill="#B8C4D0" />
      <rect x="270" y="255" width="38" height="26" rx="4" fill="#BCC8D4" />
      <rect x="90"  y="260" width="20" height="16" rx="3" fill="#C8D2DC" />
      <rect x="92"  y="306" width="22" height="16" rx="3" fill="#C8D2DC" />
      <rect x="128" y="306" width="20" height="14" rx="3" fill="#C4CED8" />
      <rect x="155" y="308" width="24" height="15" rx="3" fill="#C4CED8" />
      <rect x="218" y="305" width="26" height="18" rx="4" fill="#C0CAD8" />
      <rect x="248" y="303" width="28" height="18" rx="4" fill="#BCC6D0" />
      <rect x="282" y="300" width="32" height="20" rx="4" fill="#BCC6D0" />
      {/* MBS + Esplanade area */}
      <rect x="305" y="250" width="48" height="50" rx="6" fill="#B4BEC8" />
      <rect x="315" y="192" width="40" height="38" rx="5" fill="#B8C4CE" />
      {/* Upper CBD / Orchard fringe */}
      <rect x="152" y="172" width="32" height="22" rx="4" fill="#C8D2DC" />
      <rect x="188" y="168" width="28" height="20" rx="4" fill="#C4CED8" />
      <rect x="52"  y="178" width="38" height="28" rx="4" fill="#CBD3DC" opacity="0.8" />
      <rect x="52"  y="222" width="30" height="22" rx="4" fill="#CBD3DC" opacity="0.7" />

      {/* ── Road labels ───────────────────────────────────────────────────────── */}
      <text x="130" y="297" fontSize="7.5" fill="#8A96A4" fontWeight="600" letterSpacing="0.3">Shenton Way</text>
      <text x="170" y="248" fontSize="7" fill="#8A96A4" fontWeight="600" letterSpacing="0.3">Cecil St</text>
      <text x="215" y="320" fontSize="7.5" fill="#8A96A4" fontWeight="600" letterSpacing="0.3">Marina Blvd</text>
      <text x="258" y="185" fontSize="7" fill="#8A96A4" fontWeight="600" letterSpacing="0.2">North Bridge Rd</text>
      <text x="40"  y="160" fontSize="7" fill="#8A96A4" fontWeight="600" letterSpacing="0.3">Orchard Rd</text>
    </svg>
  );
}

/* ── Animated route overlay ─────────────────────────────────────────────────── */
/*
 * Route: user (130, 295) → Shenton Way → Robinson Rd → Raffles Place (228, 228)
 * Simplified to 4 waypoints for a convincing path.
 */
function RouteOverlay() {
  const pathRef = useRef(null);
  const [dash, setDash] = useState('0 2000');

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength?.() ?? 200;
    setDash(`${len} ${len}`);
    const raf = requestAnimationFrame(() => {
      if (pathRef.current) {
        pathRef.current.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
        pathRef.current.style.strokeDashoffset = '0';
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      viewBox="0 0 390 450"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden
    >
      {/* Shadow / glow */}
      <path
        d="M 130 295 L 155 292 L 204 289 L 204 260 L 204 228 L 228 228"
        fill="none" stroke={BRAND_ORANGE} strokeWidth="7"
        strokeLinecap="round" strokeLinejoin="round"
        opacity="0.20"
      />
      {/* Main route */}
      <path
        ref={pathRef}
        d="M 130 295 L 155 292 L 204 289 L 204 260 L 204 228 L 228 228"
        fill="none"
        stroke={BRAND_ORANGE}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dash}
        strokeDashoffset={dash.split(' ')[0]}
        opacity="0.95"
      />
      {/* Direction arrows along route */}
      <polygon points="200,274 208,278 200,282" fill={BRAND_ORANGE} opacity="0.8" />
      <polygon points="196,243 204,247 196,251" fill={BRAND_ORANGE} opacity="0.8" />
    </svg>
  );
}

export default function NavigateScreen() {
  const navigate = useNavigate();
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [spotHeld,     setSpotHeld]     = useState(false);

  /* ── Schedule timed alerts + spot toast ───────────────────────────────────── */
  useEffect(() => {
    const timers = [];

    // Spot-held toast at 2.5 s
    timers.push(setTimeout(() => setSpotHeld(true),  2500));
    timers.push(setTimeout(() => setSpotHeld(false), 6500));

    // Traffic / route alerts
    ALERTS.forEach(({ id, delay, duration }) => {
      timers.push(setTimeout(() => {
        setActiveAlerts((prev) => [...prev, id]);
        timers.push(setTimeout(() => {
          setActiveAlerts((prev) => prev.filter((a) => a !== id));
        }, duration));
      }, delay));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      {...screenPageTransition}
      className="screen-fixed"
    >

      {/* Map canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* ── Map layers ──────────────────────────────────────────────────────── */}
        <SingaporeCBDMap />
        <RouteOverlay />

        {/* ── User location dot ───────────────────────────────────────────────── */}
        {/* Outer pulse ring */}
        <div style={{
          position: 'absolute',
          top: `${295 / 450 * 100}%`, left: `${130 / 390 * 100}%`,
          width: '40px', height: '40px',
          backgroundColor: 'rgba(66,133,244,0.18)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'navPulseRing 2s ease-out infinite',
          zIndex: 1,
        }} />
        {/* Inner dot */}
        <div style={{
          position: 'absolute',
          top: `${295 / 450 * 100}%`, left: `${130 / 390 * 100}%`,
          width: '18px', height: '18px',
          backgroundColor: '#4285F4',
          borderRadius: '50%',
          border: '3px solid #fff',
          boxShadow: '0 2px 10px rgba(66,133,244,0.6)',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
        }} />

        {/* ── Carpark "P" pin ──────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute',
          top: `${(228 - 24) / 450 * 100}%`,
          left: `${228 / 390 * 100}%`,
          transform: 'translate(-50%, 0)',
          zIndex: 3,
        }}>
          <div style={{
            width: '38px', height: '38px',
            background: `linear-gradient(135deg, ${BRAND_BLUE}, #2a4070)`,
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            border: '2.5px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 16px rgba(54,84,134,0.55)`,
          }}>
            <span style={{ transform: 'rotate(45deg)', color: '#fff', fontSize: '14px', fontWeight: '800' }}>P</span>
          </div>
          {/* Pin shadow */}
          <div style={{
            width: '12px', height: '4px',
            backgroundColor: 'rgba(54,84,134,0.25)',
            borderRadius: '50%',
            margin: '2px auto 0',
          }} />
        </div>

        {/* ── Navigation card (top overlay) ───────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          backgroundColor: '#fff',
          padding: '12px 14px 14px',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', flexShrink: 0,
              background: `linear-gradient(135deg, ${BRAND_BLUE}, #2a4070)`,
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Navigation2 size={16} color="#fff" style={{ animation: 'navSpin 2s linear infinite' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px', fontWeight: '700', color: BRAND_DARK,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>→ {DEMO_CARPARK_FULL_NAME}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>
                Via Shenton Way · Robinson Rd
              </div>
            </div>
            <button
              onClick={() => navigate('/recommendations')}
              style={{
                background: 'none', border: 'none', padding: '6px',
                cursor: 'pointer', borderRadius: '8px', backgroundColor: '#F4F6F8',
                display: 'flex', alignItems: 'center', flexShrink: 0,
              }}
            >
              <X size={18} color="#9CA3AF" />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            {[
              { Icon: Clock,  text: '4 min',     bg: '#EEF2FA', color: BRAND_BLUE },
              { Icon: MapPin, text: '0.8 km',    bg: '#EEF2FA', color: BRAND_BLUE },
              { Icon: Car,    text: '47 spaces', bg: '#EEF2FA', color: BRAND_BLUE },
            ].map(({ Icon, text, bg, color }) => (
              <div key={text} style={{
                backgroundColor: bg, borderRadius: '20px',
                padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px',
                flexShrink: 0,
              }}>
                <Icon size={12} color={color} strokeWidth={2.5} />
                <span style={{ fontSize: '11px', fontWeight: '700', color: BRAND_DARK }}>{text}</span>
              </div>
            ))}
            <div style={{ backgroundColor: '#DCFCE7', borderRadius: '20px', padding: '5px 10px', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#16A34A' }}>Clear ✓</span>
            </div>
          </div>
        </div>

        {/* ── Spot held toast ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {spotHeld && (
            <motion.div
              initial={{ y: -70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -70, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              style={{
                position: 'absolute', top: '106px', left: '14px', right: '14px',
                zIndex: 20,
                background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND_BLUE})`,
                color: '#fff', borderRadius: '14px',
                padding: '11px 14px',
                display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{
                width: '28px', height: '28px', flexShrink: 0,
                backgroundColor: 'rgba(74,222,128,0.2)', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '14px' }}>✓</span>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700' }}>
                  Spot {DEMO_SPOT_LABEL} secured
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', marginTop: '1px' }}>
                  Held for 10 min · Carpark Pals reserve
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Timed traffic alerts ─────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: '195px', left: '14px', right: '14px',
          zIndex: 20,
          display: 'flex', flexDirection: 'column', gap: '6px',
          pointerEvents: 'none',
        }}>
          <AnimatePresence>
            {ALERTS.filter((a) => activeAlerts.includes(a.id)).map((alert) => {
              const Icon = alert.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                  style={{
                    backgroundColor: alert.bg,
                    border: `1px solid ${alert.border}`,
                    borderRadius: '12px', padding: '10px 13px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  }}
                >
                  <Icon size={15} color={alert.color} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: BRAND_DARK }}>
                    {alert.text}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── Bottom panel ─────────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          backgroundColor: '#fff',
          borderRadius: '22px 22px 0 0',
          padding: '16px 16px 18px',
          boxShadow: '0 -6px 28px rgba(0,0,0,0.12)',
        }}>
          {/* Turn instruction */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '42px', height: '42px', flexShrink: 0,
              background: `linear-gradient(135deg, ${BRAND_BLUE}, #2a4070)`,
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 14px rgba(54,84,134,0.3)`,
            }}>
              <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: BRAND_DARK }}>
                Turn left onto Raffles Place
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                Continue 200m to carpark entrance
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            borderTop: '1px solid #F0F2F5', paddingTop: '12px', marginBottom: '14px',
          }}>
            {[
              { value: '4 min', label: 'ETA' },
              { value: '0.8 km', label: 'Distance' },
              { value: '47', label: 'Spaces' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: BRAND_DARK }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', fontWeight: '500' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Arrived button */}
          <button
            onClick={() => navigate('/checkin')}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #d4561f 100%)`,
              color: '#fff', borderRadius: '16px', padding: '15px',
              fontSize: '15px', fontWeight: '700',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(236,100,51,0.4)',
            }}
          >
            I've Arrived ✓
          </button>
        </div>
      </div>

      <style>{`
        @keyframes navSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes navPulseRing {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
