import React from 'react';
import { MessageCircle, Sparkles, RefreshCw, Download } from 'lucide-react';
import { exportToPng, exportToPdf } from '../utils/exporter';

export default function DashboardHeader({ chatters, onReset }) {
  const [user1, user2] = chatters;

  return (
    <header style={{
      padding: '12px 16px',
      borderBottom: '1px solid var(--card-border)',
      background: 'rgba(224,229,233,0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }} className="anim-fade-up">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1100,
        margin: '0 auto',
        width: '100%',
        gap: 16,
      }}>
        {/* Empty left spacer to center the title perfectly across all viewports */}
        <div style={{ width: 85, flexShrink: 0 }} />

        {/* Center: Names */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.1rem, 3vw, 1.45rem)',
          fontWeight: 900,
          letterSpacing: '-0.025em',
          color: 'var(--on-surface)',
          lineHeight: 1.1,
          textAlign: 'center',
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          <span className="gradient-text grad-primary-text">{user1}</span>
          <span style={{ color: 'var(--on-surface-mute)', fontWeight: 400, margin: '0 8px' }}>&</span>
          <span className="gradient-text grad-secondary-text">{user2}</span>
        </h1>

        {/* Right: Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: 'auto', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => exportToPdf('dashboard-root')}
            className="export-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--bg-overlay)',
              border: '1px solid var(--card-border)',
              color: 'var(--on-surface-dim)',
              fontSize: '0.75rem',
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
            <Download size={12} />
            <span>Export PDF</span>
          </button>
          
          <button
            onClick={onReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--bg-overlay)',
              border: '1px solid var(--card-border)',
              color: 'var(--on-surface-dim)',
              fontSize: '0.75rem',
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
            <RefreshCw size={12} />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
