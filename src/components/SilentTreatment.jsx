import React from 'react';
import { MoonStar, Snowflake, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function SilentTreatment({ data }) {
  const { longestGap } = data;
  
  if (!longestGap || longestGap.durationSeconds === 0) return null;

  const formatDuration = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    let res = [];
    if (days > 0) res.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) res.push(`${hours} hr${hours > 1 ? 's' : ''}`);
    if (mins > 0 && days === 0) res.push(`${mins} min${mins > 1 ? 's' : ''}`);
    
    return res.join(', ') || 'A few seconds';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'var(--tertiary-glow)', borderRadius: '12px', color: 'var(--tertiary)' }}>
            <Snowflake size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>The Silent Treatment</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-mute)', margin: 0 }}>The longest you went without talking</p>
          </div>
        </div>
        <button
          className="export-btn"
          onClick={() => exportToPng('silent-card', 'whatswrap-silence')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--card-border)',
            borderRadius: 8, padding: '6px 12px',
            fontSize: '0.72rem', fontWeight: 600, color: 'var(--on-surface-dim)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <Download size={12} />
          <span>Export PNG</span>
        </button>
      </div>

      <div id="silent-card" className="m3-card" style={{ padding: '40px 32px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(30,41,59,0.03), rgba(15,23,42,0.08))' }}>
        <MoonStar size={48} color="var(--tertiary)" style={{ opacity: 0.8, marginBottom: '24px' }} />
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--on-surface-dim)', fontWeight: 500 }}>
          Your longest pause was
        </h3>
        <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--on-surface)', fontFamily: 'var(--font-heading)', lineHeight: 1.1, marginBottom: '16px' }}>
          {formatDuration(longestGap.durationSeconds)}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'var(--surface-sunken)', padding: '8px 16px', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--on-surface-mute)', fontWeight: 500 }}>
          <span>{longestGap.start}</span>
          <span style={{ color: 'var(--tertiary)' }}>→</span>
          <span>{longestGap.end}</span>
        </div>
      </div>
    </div>
  );
}
