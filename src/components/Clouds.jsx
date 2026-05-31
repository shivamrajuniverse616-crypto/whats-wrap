import React from 'react';
import { Cloud, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function Clouds({ data }) {
  const { topGlobalWords, topGlobalEmojis } = data;
  if (!topGlobalWords || !topGlobalEmojis) return null;

  return (
    <div className="anim-fade-up" id="clouds-card">
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(56, 189, 248, 0.15)' }}>
              <Cloud size={15} color="#38bdf8" />
            </div>
            <span className="section-title">Word & Emoji Clouds</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('clouds-card', 'whatswrap-clouds')}
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
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>
          The most frequently used vocabulary and expressions
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        
        {/* Word Cloud */}
        <div className="m3-card" style={{ padding: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', textAlign: 'center', marginBottom: 16, fontSize: '0.8rem', color: 'var(--on-surface-mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Top Words
          </div>
          {topGlobalWords.slice(0, 20).map((word, idx) => {
            const scale = 1 - (idx * 0.04);
            const opacity = 1 - (idx * 0.03);
            return (
              <span key={word[0]} style={{
                fontSize: `${1.5 * scale}rem`,
                opacity: opacity,
                fontWeight: idx < 3 ? 900 : (idx < 8 ? 700 : 500),
                color: idx < 3 ? 'var(--primary)' : 'var(--on-surface)',
                fontFamily: 'var(--font-heading)'
              }}>
                {word[0]}
              </span>
            );
          })}
        </div>

        {/* Emoji Cloud */}
        <div className="m3-card" style={{ padding: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', textAlign: 'center', marginBottom: 16, fontSize: '0.8rem', color: 'var(--on-surface-mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Top Emojis
          </div>
          {topGlobalEmojis.slice(0, 15).map((emoji, idx) => {
            const scale = 1 - (idx * 0.05);
            return (
              <span key={emoji[0]} style={{
                fontSize: `${2.5 * scale}rem`,
                filter: idx < 3 ? 'drop-shadow(0 4px 12px rgba(251,191,36,0.4))' : 'none',
                transform: `rotate(${Math.random() * 20 - 10}deg)`
              }}>
                {emoji[0]}
              </span>
            );
          })}
        </div>

      </div>
    </div>
  );
}
