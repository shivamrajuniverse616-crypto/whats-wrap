import React, { useState } from 'react';
import { Clock, User, Calendar, Laugh, Download, Image, Link, Trash2, Eye } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function TimeCapsule({ capsules }) {
  const [selectedIdx, setSelectedIdx] = useState(
    capsules.length > 0 ? capsules.length - 1 : 0
  );

  if (capsules.length === 0) {
    return (
      <div className="m3-card" style={{ padding: 48, textAlign: 'center', color: 'var(--on-surface-mute)' }}>
        Not enough monthly history found.
      </div>
    );
  }

  const capsule = capsules[selectedIdx] || capsules[0];

  return (
    <div className="anim-fade-up" id="capsule-card">
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(251,191,36,0.12)' }}>
              <Clock size={15} color="var(--warning)" />
            </div>
            <span className="section-title">Time Capsule</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('capsule-card', 'whatswrap-timecapsule')}
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
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>Relive your chat history month by month</p>
      </div>

      {/* Month picker chips */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap',
        marginBottom: 20,
        overflowX: 'auto', paddingBottom: 4,
      }} className="scrollbar-none">
        {capsules.map((cap, idx) => (
          <button
            key={cap.key}
            className={`m3-chip${selectedIdx === idx ? ' active' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            {cap.monthName}
          </button>
        ))}
      </div>

      {/* Main capsule card */}
      <div className="m3-card" style={{
        padding: '28px 28px 24px',
        background: 'linear-gradient(135deg, var(--bg-surface-2) 0%, var(--bg-surface) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Header row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'flex-start',
          gap: 16, marginBottom: 24,
        }}>
          <div>
            <div style={{
              fontSize: '0.62rem', fontWeight: 700,
              color: 'var(--warning)', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 6,
            }}>
              Time Capsule
            </div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
              fontWeight: 900, letterSpacing: '-0.03em',
              color: 'var(--on-surface)', marginBottom: 8,
            }}>
              {capsule.monthName} {capsule.year}
            </h3>
            <p style={{
              color: 'var(--on-surface-dim)', fontSize: '0.875rem',
              lineHeight: 1.6, maxWidth: 480,
            }}>
              {capsule.description}
            </p>
          </div>

          {/* Message count badge */}
          <div style={{
            background: 'var(--bg-surface-3)',
            border: '1px solid var(--card-border)',
            borderRadius: 16, padding: '16px 20px',
            textAlign: 'center', minWidth: 120, flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem', fontWeight: 900,
              color: 'var(--on-surface)', letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>
              {capsule.totalMessages.toLocaleString()}
            </div>
            <div style={{
              fontSize: '0.6rem', fontWeight: 700,
              color: 'var(--on-surface-mute)', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginTop: 4,
            }}>
              Messages
            </div>
          </div>
        </div>

        {/* 3-col info grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12, marginBottom: 16,
        }}>
          {[
            {
              label: 'Chat Champion',
              content: capsule.mainCharacter,
              sub: `${capsule.mcMessages?.toLocaleString()} messages sent`,
              Icon: User, iconColor: 'var(--primary)',
            },
            {
              label: 'Peak Active Day',
              content: capsule.busiestDay,
              sub: `Out of ${capsule.activeDaysCount} total active days`,
              Icon: Calendar, iconColor: 'var(--tertiary)',
            },
            {
              label: 'Monthly Mascot',
              content: `Mascot Emoji: ${capsule.signatureEmoji}`,
              sub: 'The emoji that defined this month\'s vibe',
              Icon: Laugh, iconColor: 'var(--warning)',
            },
          ].map(({ label, content, sub, Icon, iconColor }) => (
            <div
              key={label}
              className="m3-card"
              style={{ padding: '16px 16px 14px', background: 'var(--bg-overlay)' }}
            >
              <div style={{
                fontSize: '0.6rem', fontWeight: 700,
                color: 'var(--on-surface-mute)', textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Icon size={11} color={iconColor} />
                {label}
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem', fontWeight: 700,
                color: 'var(--on-surface)', marginBottom: 4,
              }}>
                {content}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-mute)' }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Quote pair replacement: Fun Activity Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            {
              label: 'Visual Dump',
              content: `${capsule.mediaCount?.toLocaleString() ?? 0} items`,
              sub: 'Photos, videos, stickers & audios shared',
              Icon: Image, iconColor: 'var(--primary)',
            },
            {
              label: 'Ephemeral Peeks',
              content: `${capsule.viewOnceCount?.toLocaleString() ?? 0} media`,
              sub: 'View-once disappearing photos & videos',
              Icon: Eye, iconColor: 'var(--warning)',
            },
            {
              label: 'Hyperlink Portals',
              content: `${capsule.linksCount?.toLocaleString() ?? 0} links`,
              sub: 'Web addresses and shared recommendations',
              Icon: Link, iconColor: 'var(--tertiary)',
            },
            {
              label: 'Ghost Whispers',
              content: `${capsule.deletedCount?.toLocaleString() ?? 0} deleted`,
              sub: 'Messages sent and then mysteriously redacted',
              Icon: Trash2, iconColor: 'var(--pink-accent)',
            },
          ].map(({ label, content, sub, Icon, iconColor }) => (
            <div
              key={label}
              className="m3-card"
              style={{ padding: '16px 16px 14px', background: 'var(--bg-overlay)' }}
            >
              <div style={{
                fontSize: '0.6rem', fontWeight: 700,
                color: 'var(--on-surface-mute)', textTransform: 'uppercase',
                letterSpacing: '0.1em', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Icon size={11} color={iconColor} />
                {label}
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem', fontWeight: 700,
                color: 'var(--on-surface)', marginBottom: 4,
              }}>
                {content}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-mute)' }}>
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
