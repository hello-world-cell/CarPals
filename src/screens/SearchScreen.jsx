import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, ChevronRight, MapPin, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { screenPageTransition } from '../pageTransition';
import { SINGAPORE_LOCATIONS, TYPE_META } from '../data/singaporeLocations';
import { searchLocations, getHighlightSegments } from '../utils/fuzzySearch';

const BRAND_BLUE   = '#365486';
const BRAND_ORANGE = '#ec6433';
const BRAND_DARK   = '#0D1B3E';

const RECENT = [
  { name: 'Marina Bay Sands',  address: '10 Bayfront Ave, Singapore' },
  { name: 'Raffles Place MRT', address: '1 Raffles Place, Singapore' },
];

const POPULAR = [
  { name: 'VivoCity',           address: '1 HarbourFront Walk', badge: '120+ spaces',    badgeBg: '#DCFCE7', badgeColor: '#16A34A', price: '1.50' },
  { name: 'Orchard Road',       address: '176 Orchard Rd',      badge: 'Limited spaces', badgeBg: '#FEF9C3', badgeColor: '#CA8A04', price: '3.00' },
  { name: 'Marina Bay Sands',   address: '10 Bayfront Ave',     badge: '32 spaces left', badgeBg: '#FEE2E2', badgeColor: '#DC2626', price: '4.00' },
];

/** Highlight matched portion in orange */
function HighlightText({ text, query }) {
  const segments = getHighlightSegments(text, query);
  return (
    <span>
      {segments.map((seg, i) =>
        seg.highlight
          ? <span key={i} style={{ color: BRAND_ORANGE, fontWeight: '700' }}>{seg.text}</span>
          : <span key={i}>{seg.text}</span>
      )}
    </span>
  );
}

export default function SearchScreen() {
  const navigate  = useNavigate();
  const inputRef  = useRef(null);
  const [query,          setQuery]          = useState('');
  const [suggestions,    setSuggestions]    = useState([]);
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [selectedName,   setSelectedName]   = useState('');

  /* ── search handler ─────────────────────────────────────────────────────── */
  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedName('');
    if (val.trim().length >= 1) {
      setSuggestions(searchLocations(val, SINGAPORE_LOCATIONS, 7));
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, []);

  const handleSelect = (loc) => {
    setQuery(loc.name);
    setSelectedName(loc.name);
    setShowDropdown(false);
    setLoading(true);
    setTimeout(() => navigate('/recommendations'), 900);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedName('');
    inputRef.current?.focus();
  };

  const handleSearchSubmit = () => {
    setShowDropdown(false);
    setLoading(true);
    setTimeout(() => navigate('/recommendations'), 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
    if (e.key === 'Escape') { setShowDropdown(false); inputRef.current?.blur(); }
  };

  return (
    <motion.div
      {...screenPageTransition}
      style={{
        backgroundColor: '#F4F6F8',
        display: 'flex', flexDirection: 'column',
        minHeight: 'calc(100svh - var(--header-h))',
      }}
    >
      {/* ── Loading overlay ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 400,
              backgroundColor: '#fff',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '16px',
            }}
          >
            <div style={{
              width: '48px', height: '48px',
              border: '3px solid #EEF2FA',
              borderTopColor: BRAND_BLUE,
              borderRadius: '50%',
              animation: 'carpals-spin 0.75s linear infinite',
            }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: '700', color: BRAND_DARK, margin: 0 }}>
                {selectedName ? `Searching near "${selectedName}"` : 'Finding best carparks…'}
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                Analysing 47 carparks via AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scrollable body ───────────────────────────────────────────────────── */}
      <div
        className="no-scrollbar"
        style={{ flex: 1, overflowY: 'auto' }}
      >
        {/* Hero header */}
        <div style={{
          background: `linear-gradient(160deg, ${BRAND_DARK} 0%, ${BRAND_BLUE} 100%)`,
          padding: '20px 20px 28px',
          position: 'relative',
        }}>
          {/* Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #ec6433, #d4561f)',
              borderRadius: '12px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(236,100,51,0.4)',
            }}>
              <span style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>P</span>
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: '700', color: '#fff' }}>
                Good morning, Alex 👋
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>
                Find smart parking in Singapore
              </div>
            </div>
          </div>

          {/* Search bar + dropdown anchor */}
          <div style={{ position: 'relative' }}>
            <div style={{
              backgroundColor: '#fff', borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: '10px',
              border: `2px solid ${showDropdown ? BRAND_ORANGE : 'transparent'}`,
              transition: 'border-color 0.2s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}>
              <Search size={18} color={showDropdown ? BRAND_ORANGE : '#9CA3AF'} strokeWidth={2} style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                onFocus={() => query.trim().length >= 1 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 180)}
                onKeyDown={handleKeyDown}
                placeholder="Search MRT, mall, or landmark…"
                style={{
                  flex: 1, background: 'transparent',
                  border: 'none', outline: 'none',
                  fontSize: '15px', color: BRAND_DARK, fontWeight: '500',
                  minWidth: 0,
                }}
              />
              {query.length > 0 ? (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  style={{
                    background: 'none', border: 'none', padding: '2px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    color: '#9CA3AF', flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              ) : (
                <div style={{
                  backgroundColor: BRAND_BLUE, borderRadius: '8px',
                  padding: '5px 10px', flexShrink: 0,
                  fontSize: '11px', fontWeight: '600', color: '#fff',
                }}>
                  Search
                </div>
              )}
            </div>

            {/* ── Autocomplete dropdown ──────────────────────────────────────── */}
            <AnimatePresence>
              {showDropdown && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)',
                    left: 0, right: 0,
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                    zIndex: 250,
                    overflow: 'hidden',
                    border: '1px solid #F0F2F5',
                    transformOrigin: 'top center',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: '10px 14px 6px',
                    fontSize: '10px', fontWeight: '700', color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: '0.8px',
                    borderBottom: '1px solid #F8FAFC',
                  }}>
                    {suggestions.length} result{suggestions.length !== 1 ? 's' : ''}
                  </div>

                  {suggestions.map((loc, idx) => {
                    const meta = TYPE_META[loc.type] ?? { emoji: '📍', label: loc.type };
                    return (
                      <div
                        key={loc.id}
                        onMouseDown={(e) => { e.preventDefault(); handleSelect(loc); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '11px 14px',
                          cursor: 'pointer',
                          borderBottom: idx < suggestions.length - 1 ? '1px solid #F8FAFC' : 'none',
                          transition: 'background-color 0.1s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Icon */}
                        <div style={{
                          width: '34px', height: '34px', flexShrink: 0,
                          backgroundColor: '#EEF2FA', borderRadius: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '17px',
                        }}>
                          {meta.emoji}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: BRAND_DARK, lineHeight: 1.3 }}>
                            <HighlightText text={loc.name} query={query} />
                          </div>
                          <div style={{
                            fontSize: '11px', color: '#9CA3AF', marginTop: '2px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {loc.area} · {loc.address}
                          </div>
                        </div>

                        {/* Type badge */}
                        <span style={{
                          fontSize: '10px', fontWeight: '700', flexShrink: 0,
                          backgroundColor: '#EEF2FA', color: BRAND_BLUE,
                          padding: '3px 7px', borderRadius: '8px',
                        }}>
                          {meta.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Recent searches ───────────────────────────────────────────────── */}
        <div style={{ padding: '18px 20px 4px', backgroundColor: '#fff' }}>
          <div style={{
            fontSize: '11px', fontWeight: '700', color: '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.8px',
          }}>Recent</div>
        </div>

        {RECENT.map((item, idx) => (
          <div
            key={item.name}
            onClick={() => navigate('/recommendations')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 20px',
              backgroundColor: '#fff',
              borderBottom: idx < RECENT.length - 1 ? '1px solid #F8F8F8' : '1px solid #F0F2F5',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '38px', height: '38px', flexShrink: 0,
              backgroundColor: '#F4F6F8', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock size={16} color="#C4C9D4" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: BRAND_DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>{item.address}</div>
            </div>
            <ChevronRight size={16} color="#D1D5DB" />
          </div>
        ))}

        {/* ── Popular near you ──────────────────────────────────────────────── */}
        <div style={{ padding: '20px 20px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Popular near you
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              backgroundColor: '#EEF2FA', borderRadius: '20px', padding: '4px 10px',
            }}>
              <Zap size={11} color={BRAND_BLUE} fill={BRAND_BLUE} />
              <span style={{ fontSize: '10px', fontWeight: '700', color: BRAND_BLUE }}>AI ranked</span>
            </div>
          </div>

          {POPULAR.map((card) => (
            <div
              key={card.name}
              onClick={() => navigate('/recommendations')}
              style={{
                backgroundColor: '#fff', borderRadius: '16px',
                padding: '14px 16px', marginBottom: '10px',
                border: '1px solid #F0F2F5',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: '44px', height: '44px', flexShrink: 0,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${BRAND_BLUE}22, ${BRAND_BLUE}11)`,
                border: `1px solid ${BRAND_BLUE}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={20} color={BRAND_BLUE} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: BRAND_DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.name}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>{card.address}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600',
                  padding: '3px 8px', borderRadius: '20px',
                  backgroundColor: card.badgeBg, color: card.badgeColor,
                  whiteSpace: 'nowrap',
                }}>{card.badge}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>from S${card.price}/hr</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────────── */}
        <div style={{ padding: '16px 20px 24px' }}>
          <motion.button
            animate={{ scale: [1, 1.025, 1, 1.025, 1] }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.6 }}
            onClick={handleSearchSubmit}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #d4561f 100%)`,
              color: '#fff', borderRadius: '16px', padding: '16px',
              fontSize: '15px', fontWeight: '700',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 24px rgba(236,100,51,0.45)',
              letterSpacing: '0.2px',
            }}
          >
            <MapPin size={18} strokeWidth={2.5} />
            Find Parking Near Me
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
