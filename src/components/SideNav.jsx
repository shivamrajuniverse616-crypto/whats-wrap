import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Clock, Trophy, UserCircle2, HeartPulse, GitCommit, RefreshCw, MessageCircle, History, Calendar as CalIcon, Cloud as CloudIcon, Hourglass, Snowflake, Link2, BookOpen, Menu } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',       Icon: LayoutDashboard },
  { id: 'heatmap',       label: 'Activity',       Icon: CalIcon },
  { id: 'clouds',        label: 'Clouds',         Icon: CloudIcon },
  { id: 'first-message', label: 'First Message',  Icon: History },
  { id: 'capsule',       label: 'Time Capsule',   Icon: Clock },
  { id: 'awards',        label: 'Awards',         Icon: Trophy },
  { id: 'response',      label: 'Response Time',  Icon: Hourglass },
  { id: 'silent',        label: 'Silent Gap',     Icon: Snowflake },
  { id: 'media-diet',    label: 'Media Diet',     Icon: Link2 },
  { id: 'typology',      label: 'Typology',       Icon: BookOpen },
  { id: 'personalities', label: 'Personalities',  Icon: UserCircle2 },
  { id: 'longest',       label: 'Longest Texts',  Icon: MessageCircle },
  { id: 'compatibility', label: 'Compatibility',  Icon: HeartPulse },
  { id: 'milestones',    label: 'Milestones',     Icon: GitCommit },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function SideNav({ onReset, chatters, streak }) {
  const [active, setActive] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const options = { rootMargin: '-30% 0px -60% 0px', threshold: 0 };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, options);

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleClick = (id) => {
    setActive(id);
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'visible' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ── Desktop Sidebar / Mobile Drawer ── */}
      <aside className={`sidenav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="sidenav-brand">
          <div className="sidenav-brand-icon">
            <MessageCircle size={18} color="#fff" />
          </div>
          <span className="sidenav-brand-text">WhatsWrap</span>
        </div>

        {/* Chatters badge */}
        {chatters && chatters.length >= 2 && (
          <div style={{
            padding: '10px 12px',
            marginBottom: 20,
            borderRadius: 12,
            background: 'var(--bg-overlay)',
            border: '1px solid var(--card-border)',
          }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--on-surface-mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Chat Between
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.5 }}>
              {chatters[0]}
              <span style={{ color: 'var(--on-surface-mute)', fontWeight: 400 }}> & </span>
              {chatters[1]}
            </div>
            {streak > 0 && (
              <div style={{
                marginTop: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#fb923c',
                background: 'rgba(251,146,60,0.1)',
                border: '1px solid rgba(251,146,60,0.2)',
                borderRadius: 999,
                padding: '2px 8px',
              }}>
                🔥 {streak}d streak
              </div>
            )}
          </div>
        )}

        {/* Nav label */}
        <div className="sidenav-section-label">Navigation</div>

        {/* Nav items */}
        <nav className="sidenav-nav">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sidenav-item${active === id ? ' active' : ''}`}
              onClick={() => handleClick(id)}
            >
              <Icon className="sidenav-item-icon" size={18} />
              <span>{label}</span>
              {active === id && (
                <div style={{
                  position: 'absolute',
                  right: 10,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  boxShadow: '0 0 8px var(--primary)',
                }} />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom reset */}
        <div className="sidenav-bottom">
          <button className="sidenav-reset-btn" onClick={onReset}>
            <RefreshCw size={15} />
            <span>New Chat</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-bottom-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`mobile-nav-item${active === id ? ' active' : ''}`}
            onClick={() => handleClick(id)}
          >
            <Icon className="mobile-nav-item-icon" size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
