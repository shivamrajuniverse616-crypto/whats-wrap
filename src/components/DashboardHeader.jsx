import React from 'react';
import { MessageCircle, Sparkles, RefreshCw, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function DashboardHeader({ chatters, streak, onReset, startDate }) {
  const [user1, user2] = chatters;

  const handleDownloadAll = async () => {
    const u1Id = `longest-msg-${user1.replace(/\s+/g, '-')}`;
    const u2Id = `longest-msg-${user2.replace(/\s+/g, '-')}`;
    const cards = [
      { id: 'overview-card', name: 'whatswrap-overview' },
      { id: 'capsule-card', name: 'whatswrap-timecapsule' },
      { id: 'awards-card', name: 'whatswrap-awards' },
      { id: 'personalities-card', name: 'whatswrap-personalities' },
      { id: u1Id, name: `whatswrap-longest-msg-${user1.toLowerCase()}` },
      { id: u2Id, name: `whatswrap-longest-msg-${user2.toLowerCase()}` },
      { id: 'compatibility-card', name: 'whatswrap-compatibility' },
      { id: 'milestones-card', name: 'whatswrap-milestones' },
    ];
    for (const card of cards) {
      const element = document.getElementById(card.id);
      const contentBox = element?.querySelector('.collapsible-content');
      const buttonRow = element?.querySelector('.toggle-btn-row');
      
      let originalMaxHeight = '';
      let originalDisplay = '';
      if (contentBox) {
        originalMaxHeight = contentBox.style.maxHeight;
        contentBox.style.maxHeight = 'none';
      }
      if (buttonRow) {
        originalDisplay = buttonRow.style.display;
        buttonRow.style.display = 'none';
      }

      await exportToPng(card.id, card.name);

      if (contentBox) contentBox.style.maxHeight = originalMaxHeight;
      if (buttonRow) buttonRow.style.display = originalDisplay;

      await new Promise(resolve => setTimeout(resolve, 600));
    }
  };

  return (
    <header style={{
      padding: '16px 20px',
      borderBottom: '1px solid var(--card-border)',
      background: 'rgba(224,229,233,0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }} className="anim-fade-up header-responsive">
      <style>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          maxWidth: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .header-left {
          min-width: 0;
          flex: 1;
        }
        .header-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .header-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .header-left {
            width: 100%;
          }
          .header-actions {
            width: 100%;
            justify-content: space-between;
          }
          .header-actions button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
      <div className="header-container">
        {/* Left: Brand + Title */}
        <div className="header-left">
          <div className="header-badges">
            {/* Brand pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--grad-primary)',
              borderRadius: 8, padding: '3px 10px',
            }}>
              <MessageCircle size={11} color="#fff" />
              <span style={{
                fontSize: '0.62rem', fontWeight: 800,
                color: '#fff', letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading)',
              }}>
                WhatsWrap
              </span>
            </div>

            {/* Start Date badge */}
            {startDate && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'var(--bg-overlay)',
                border: '1px solid var(--card-border)',
                borderRadius: 999,
                padding: '3px 10px',
                fontSize: '0.7rem', fontWeight: 700,
                color: 'var(--primary)',
                whiteSpace: 'nowrap',
              }}>
                📅 Started {startDate}
              </div>
            )}

            {/* Streak badge */}
            {streak > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(251,146,60,0.1)',
                border: '1px solid rgba(251,146,60,0.25)',
                borderRadius: 999,
                padding: '3px 10px',
                fontSize: '0.7rem', fontWeight: 700,
                color: '#fb923c',
                whiteSpace: 'nowrap',
              }}>
                🔥 {streak} Day Streak
              </div>
            )}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--on-surface)',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            <span className="gradient-text grad-primary-text">{user1}</span>
            <span style={{ color: 'var(--on-surface-mute)', fontWeight: 400, margin: '0 8px' }}>&</span>
            <span className="gradient-text grad-secondary-text">{user2}</span>
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="header-actions">
          {/* Download All PNGs */}
          <button
            onClick={handleDownloadAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px',
              borderRadius: 12,
              background: 'var(--primary)',
              border: '1px solid transparent',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--primary-dim)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--primary)';
            }}
          >
            <Download size={14} />
            <span>Download All PNGs</span>
          </button>

          {/* New Chat */}
          <button
            onClick={onReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px',
              borderRadius: 12,
              background: 'var(--bg-overlay)',
              border: '1px solid var(--card-border)',
              color: 'var(--on-surface-dim)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.background = 'var(--primary-glow)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--card-border)';
              e.currentTarget.style.color = 'var(--on-surface-dim)';
              e.currentTarget.style.background = 'var(--bg-overlay)';
            }}
          >
            <RefreshCw size={14} />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
