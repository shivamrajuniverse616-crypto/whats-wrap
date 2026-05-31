import React from 'react';
import { Trophy, Smartphone, Wind, Palette, Image, MessageSquare, Link, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

const COLOR_MAP = {
  sunset:  { border: 'rgba(251,133,0,0.25)',  bg: 'rgba(251,133,0,0.05)',  text: '#fb8500', badge: 'rgba(251,133,0,0.12)' },
  purple:  { border: 'rgba(144,224,239,0.25)', bg: 'rgba(144,224,239,0.05)', text: '#90e0ef', badge: 'rgba(144,224,239,0.12)' },
  gold:    { border: 'rgba(255,183,3,0.25)',   bg: 'rgba(255,183,3,0.05)',   text: '#ffb703', badge: 'rgba(255,183,3,0.12)' },
  royal:   { border: 'rgba(247,37,133,0.25)',  bg: 'rgba(247,37,133,0.05)',  text: '#f72585', badge: 'rgba(247,37,133,0.12)' },
  emerald: { border: 'rgba(0,180,216,0.25)',   bg: 'rgba(0,180,216,0.05)',   text: '#00b4d8', badge: 'rgba(0,180,216,0.12)' },
  cyan:    { border: 'rgba(0,168,150,0.25)',   bg: 'rgba(0,168,150,0.05)',   text: '#00a896', badge: 'rgba(0,168,150,0.12)' },
};

const AWARD_ICONS = {
  'double-text': Smartphone,
  'chaos': Wind,
  'emoji': Palette,
  'meme-lord': Image,
  'yapper': MessageSquare,
  'search-bar': Link,
};

export default function UniverseAwards({ awards }) {
  return (
    <div className="anim-fade-up" id="awards-card">
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(251,191,36,0.12)' }}>
              <Trophy size={15} color="var(--warning)" />
            </div>
            <span className="section-title">Alternate Universe Awards</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('awards-card', 'whatswrap-awards')}
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
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>Celebrating your chat quirks in style</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }} className="stagger">
        {awards.map((award) => {
          const colors = COLOR_MAP[award.colorClass] || COLOR_MAP.royal;
          const AwardIcon = AWARD_ICONS[award.id] || Trophy;

          return (
            <div
              key={award.id}
              className="m3-card hover-lift"
              style={{
                padding: '24px',
                border: `1px solid ${colors.border}`,
                background: colors.bg,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    color: 'var(--on-surface-mute)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: 6,
                  }}>
                    Alternate Universe Award
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem', fontWeight: 800,
                    color: 'var(--on-surface)', letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}>
                    {award.title}
                  </h3>
                </div>

                {/* Icon Badge instead of raw emoji */}
                <div style={{
                  width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                  background: colors.badge,
                  border: `1px solid ${colors.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AwardIcon size={24} color={colors.text} />
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-dim)', lineHeight: 1.6 }}>
                {award.description}
              </p>

              {/* Winner box */}
              <div style={{
                background: 'var(--bg-surface-3)',
                border: '1px solid var(--card-border)',
                borderRadius: 12, padding: '12px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    color: 'var(--on-surface-mute)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: 3,
                  }}>
                    Winner
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem', fontWeight: 800,
                    color: colors.text,
                  }}>
                    {award.winner}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    color: 'var(--on-surface-mute)',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: 3,
                  }}>
                    {award.metricName}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem', fontWeight: 900,
                    color: 'var(--on-surface)',
                  }}>
                    {award.score.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
