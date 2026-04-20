import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle,
  Share2,
  Wallet,
  Crown,
  ShieldCheck,
  Car,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_CARPARK_FULL_NAME, DEMO_SPOT_LABEL } from '../demoSession';
import { screenPageTransition } from '../pageTransition';

const BRAND_BLUE   = '#365486';
const BRAND_ORANGE = '#ec6433';
const BRAND_DARK   = '#0D1B3E';

/* ── Constants ──────────────────────────────────────────────────────────────── */
const PARKING_FEE      = 2.67;   // S$2.67 for 1hr 4min
const WALLET_BALANCE   = 0.40;   // Starting wallet credit
const CASHBACK_RATE    = 0.15;   // 15% of amount paid

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function fmt(n) { return `S$${n.toFixed(2)}`; }

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

/* ── Toggle switch ───────────────────────────────────────────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: '44px', height: '24px',
        backgroundColor: on ? BRAND_BLUE : '#D1D5DB',
        borderRadius: '12px', position: 'relative', cursor: 'pointer',
        transition: 'background-color 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '2px',
        left: on ? '22px' : '2px',
        width: '20px', height: '20px',
        backgroundColor: '#fff', borderRadius: '50%',
        transition: 'left 0.2s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </div>
  );
}

/* ── Fee row ─────────────────────────────────────────────────────────────────── */
function FeeRow({ label, value, valueColor, bold, borderTop, borderStyle }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 0',
      borderTop: borderTop ? `${borderStyle ?? '1px solid #F0F2F5'}` : 'none',
    }}>
      <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: bold ? '600' : '400' }}>{label}</span>
      <span style={{
        fontSize: bold ? '15px' : '13px',
        fontWeight: bold ? '800' : '600',
        color: valueColor ?? BRAND_DARK,
      }}>{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAYMENT VIEW
══════════════════════════════════════════════════════════════════════════════ */
function PaymentView({ onApprove, processing, applyCashback, setApplyCashback }) {
  const navigate = useNavigate();

  const entryTime = useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - 64);
    return d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const cashbackApplied = applyCashback ? WALLET_BALANCE : 0;
  const finalAmount     = +(PARKING_FEE - cashbackApplied).toFixed(2);

  return (
    <div style={{
      backgroundColor: '#F4F6F8',
      display: 'flex', flexDirection: 'column',
      minHeight: 'calc(100svh - var(--header-h))',
    }}>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>

        {/* Header */}
        <header style={{
          backgroundColor: '#fff', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '12px',
          borderBottom: '1px solid #F0F2F5',
        }}>
          <button
            onClick={() => navigate('/checkin')}
            style={{
              background: 'none', border: 'none', padding: '6px',
              cursor: 'pointer', borderRadius: '8px', backgroundColor: '#F4F6F8',
              display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronLeft size={20} color={BRAND_DARK} strokeWidth={2.5} />
          </button>
          <span style={{ fontSize: '16px', fontWeight: '700', color: BRAND_DARK }}>Approve Payment</span>
        </header>

        {/* ── IU / Vehicle card ─────────────────────────────────────────────── */}
        <div style={{
          margin: '14px 16px 0',
          background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${BRAND_BLUE} 100%)`,
          borderRadius: '20px', padding: '18px 20px',
          boxShadow: '0 6px 24px rgba(54,84,134,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Car size={22} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>
                  SGX 1234A
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>
                  IU No: ●●●● 8842
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(74,222,128,0.2)',
              border: '1px solid rgba(74,222,128,0.4)',
              borderRadius: '20px', padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#4ADE80', borderRadius: '50%', animation: 'carpals-pulse 1.6s ease-in-out infinite' }} />
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#4ADE80' }}>Connected</span>
            </div>
          </div>

          <div style={{
            marginTop: '14px', paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <ShieldCheck size={14} color={BRAND_ORANGE} strokeWidth={2.5} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
              Linked to Carpark Pals · Automatic billing authorised
            </span>
          </div>
        </div>

        {/* ── Parking summary card ──────────────────────────────────────────── */}
        <div style={{
          backgroundColor: '#fff', margin: '12px 16px 0',
          borderRadius: '20px', padding: '18px 20px',
          boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
          border: '1px solid #F0F2F5',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: '700', color: '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px',
          }}>Parking Summary</div>

          {[
            { label: 'Carpark',    value: DEMO_CARPARK_FULL_NAME },
            { label: 'Spot',       value: DEMO_SPOT_LABEL },
            { label: 'Duration',   value: '1 hr 4 min' },
            { label: 'Entry time', value: entryTime },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0', borderBottom: '1px solid #F8FAFC',
            }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>{label}</span>
              <span style={{
                fontSize: '13px', fontWeight: '600', color: BRAND_DARK,
                maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', textAlign: 'right',
              }}>{value}</span>
            </div>
          ))}

          <div style={{ borderTop: '2px dashed #E5E7EB', margin: '12px 0 8px' }} />

          <FeeRow label="Parking fee · 1 hr 4 min" value={fmt(PARKING_FEE)} />
          <FeeRow
            label="Carpark Pals service fee"
            value={
              <span style={{
                fontSize: '11px', fontWeight: '800', color: '#16A34A',
                backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '10px',
              }}>FREE</span>
            }
          />
        </div>

        {/* ── Cashback wallet card ──────────────────────────────────────────── */}
        <div style={{
          backgroundColor: '#fff', margin: '12px 16px 0',
          borderRadius: '20px', padding: '18px 20px',
          boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
          border: applyCashback ? `1.5px solid ${BRAND_ORANGE}50` : '1px solid #F0F2F5',
          transition: 'border-color 0.2s',
        }}>
          {/* Toggle row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', flexShrink: 0,
                background: applyCashback
                  ? `linear-gradient(135deg, ${BRAND_ORANGE}, #d4561f)`
                  : '#F4F6F8',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <Wallet size={18} color={applyCashback ? '#fff' : '#9CA3AF'} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: BRAND_DARK }}>
                  Carpark Pals Wallet
                </div>
                <div style={{ fontSize: '12px', color: applyCashback ? BRAND_ORANGE : '#9CA3AF', marginTop: '1px', fontWeight: '600' }}>
                  {fmt(WALLET_BALANCE)} available
                </div>
              </div>
            </div>
            <Toggle on={applyCashback} onChange={setApplyCashback} />
          </div>

          {/* Breakdown */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '12px 14px' }}>
            <FeeRow label="Parking fee" value={fmt(PARKING_FEE)} />
            <AnimatePresence>
              {applyCashback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FeeRow
                    label="Cashback applied"
                    value={<span style={{ color: '#16A34A', fontWeight: '700' }}>−{fmt(cashbackApplied)}</span>}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ borderTop: '2px solid #E5E7EB', marginTop: '8px', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: BRAND_DARK }}>You pay</span>
                <motion.span
                  key={finalAmount}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ fontSize: '22px', fontWeight: '800', color: BRAND_BLUE }}
                >
                  {fmt(finalAmount)}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Premium hint */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginTop: '10px', padding: '8px 10px',
            backgroundColor: '#EEF2FA', borderRadius: '10px',
          }}>
            <Crown size={13} color={BRAND_BLUE} strokeWidth={2.5} />
            <span style={{ fontSize: '11px', color: BRAND_BLUE, fontWeight: '600' }}>
              Premium member · earn {fmt(+(finalAmount * CASHBACK_RATE).toFixed(2))} cashback on this payment
            </span>
          </div>
        </div>

        {/* ── Approve button ────────────────────────────────────────────────── */}
        <div style={{ padding: '16px' }}>
          <button
            type="button"
            disabled={processing}
            onClick={onApprove}
            style={{
              width: '100%',
              background: processing
                ? '#9CA3AF'
                : `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #d4561f 100%)`,
              color: '#fff', borderRadius: '16px', padding: '17px',
              fontSize: '15px', fontWeight: '800',
              border: 'none', cursor: processing ? 'wait' : 'pointer',
              boxShadow: processing ? 'none' : '0 8px 24px rgba(236,100,51,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s',
            }}
          >
            {processing ? (
              <>
                <span style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.35)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'carpals-spin 0.75s linear infinite', flexShrink: 0,
                }} />
                Authorising…
              </>
            ) : (
              <>
                <ShieldCheck size={18} strokeWidth={2.5} />
                Approve Payment · {fmt(finalAmount)}
              </>
            )}
          </button>

          <p style={{
            textAlign: 'center', fontSize: '11px', color: '#9CA3AF',
            marginTop: '10px', lineHeight: 1.5,
          }}>
            Secured via LTA-linked IU · Carpark Pals wallet
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SUCCESS VIEW
══════════════════════════════════════════════════════════════════════════════ */
function SuccessView({ applyCashback }) {
  const navigate = useNavigate();

  const cashbackApplied = applyCashback ? WALLET_BALANCE : 0;
  const amountPaid      = +(PARKING_FEE - cashbackApplied).toFixed(2);
  const cashbackEarned  = +(amountPaid * CASHBACK_RATE).toFixed(2);
  const newBalance      = +(cashbackEarned).toFixed(2);   // wallet was drained if applied

  return (
    <div style={{
      backgroundColor: '#fff',
      display: 'flex', flexDirection: 'column',
      minHeight: 'calc(100svh - var(--header-h))',
    }}>

      <div className="no-scrollbar" style={{
        flex: 1, overflowY: 'auto',
        padding: '24px 20px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* ── Checkmark ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(22,163,74,0.2)',
          }}
        >
          <CheckCircle size={40} color="#16A34A" strokeWidth={2.5} />
        </motion.div>

        <h1 style={{ fontSize: '22px', fontWeight: '800', color: BRAND_DARK, margin: '0 0 4px', textAlign: 'center' }}>
          Payment Approved!
        </h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: '0 0 20px', textAlign: 'center' }}>
          {fmt(amountPaid)} charged via IU No: ●●●● 8842
        </p>

        {/* ── Transaction summary card ──────────────────────────────────────── */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 22 }}
          style={{
            width: '100%', marginBottom: '14px',
            backgroundColor: '#F8FAFC', borderRadius: '18px',
            padding: '18px', border: '1px solid #F0F2F5',
          }}
        >
          <div style={{
            fontSize: '11px', fontWeight: '700', color: '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px',
          }}>Transaction Details</div>

          <FeeRow label="Parking fee" value={fmt(PARKING_FEE)} />
          {applyCashback && (
            <FeeRow
              label="Wallet cashback used"
              value={<span style={{ color: '#16A34A', fontWeight: '700' }}>−{fmt(cashbackApplied)}</span>}
            />
          )}
          <FeeRow
            label="Amount charged"
            value={fmt(amountPaid)}
            bold borderTop
            borderStyle="2px solid #E5E7EB"
          />
        </motion.div>

        {/* ── Wallet update card ────────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 220, damping: 22 }}
          style={{
            width: '100%', marginBottom: '14px',
            background: 'linear-gradient(135deg, #FFF8F0, #FEF0E0)',
            borderRadius: '18px', padding: '18px',
            border: `1.5px solid ${BRAND_ORANGE}25`,
            boxShadow: '0 4px 20px rgba(236,100,51,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '36px', height: '36px', flexShrink: 0,
              background: `linear-gradient(135deg, ${BRAND_ORANGE}, #d4561f)`,
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(236,100,51,0.35)',
            }}>
              <Sparkles size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: BRAND_ORANGE }}>
                +{fmt(cashbackEarned)} cashback earned!
              </div>
              <div style={{ fontSize: '11px', color: '#B45309', marginTop: '1px' }}>
                {(CASHBACK_RATE * 100).toFixed(0)}% of {fmt(amountPaid)} · Premium rate
              </div>
            </div>
          </div>

          {/* Wallet balance row */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={16} color={BRAND_ORANGE} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: BRAND_DARK }}>New wallet balance</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '800', color: BRAND_ORANGE }}>
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.25 }}
              >
                {applyCashback ? fmt(0) : fmt(WALLET_BALANCE)}
              </motion.span>
              <span>→</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.25 }}
              >
                {fmt(newBalance)}
              </motion.span>
            </div>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: `rgba(236,100,51,0.12)`, border: `1px solid ${BRAND_ORANGE}30`,
            color: BRAND_ORANGE, borderRadius: '20px', padding: '5px 12px',
            fontSize: '11px', fontWeight: '700', marginTop: '10px',
          }}>
            <Crown size={12} strokeWidth={2.5} />
            Premium members earn 2× cashback
          </div>
        </motion.div>

        {/* ── Stats row ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            display: 'flex', justifyContent: 'space-around', width: '100%',
            marginBottom: '20px', backgroundColor: '#F8FAFC',
            borderRadius: '16px', padding: '14px', border: '1px solid #F0F2F5',
          }}
        >
          {[
            { value: '15', label: 'Parkings' },
            { value: `S$${(4.20 + cashbackEarned).toFixed(2)}`, label: 'Total earned' },
            { value: '2h 38m', label: 'Time saved' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: BRAND_DARK }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '3px', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Action buttons ─────────────────────────────────────────────────── */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            style={{
              width: '100%', backgroundColor: '#fff',
              border: `2px solid ${BRAND_BLUE}`, color: BRAND_BLUE,
              borderRadius: '16px', padding: '14px',
              fontSize: '14px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: 'pointer',
            }}
          >
            <Share2 size={17} strokeWidth={2.5} />
            Share My Savings
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, #2a4070 100%)`,
              color: '#fff', borderRadius: '16px', padding: '14px',
              fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(54,84,134,0.3)',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   PAYMENT SCREEN (root)
══════════════════════════════════════════════════════════════════════════════ */
export default function PaymentScreen() {
  const [screen,        setScreen]        = useState('payment');
  const [applyCashback, setApplyCashback] = useState(true);
  const [processing,    setProcessing]    = useState(false);
  const timerRef = useRef(null);

  const handleApprove = () => {
    if (processing || screen !== 'payment') return;
    setProcessing(true);
    timerRef.current = setTimeout(() => {
      setProcessing(false);
      setScreen('success');
    }, 1600);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <motion.div
      key={screen}
      {...screenPageTransition}
    >
      {screen === 'payment' ? (
        <PaymentView
          onApprove={handleApprove}
          processing={processing}
          applyCashback={applyCashback}
          setApplyCashback={setApplyCashback}
        />
      ) : (
        <SuccessView applyCashback={applyCashback} />
      )}
    </motion.div>
  );
}
