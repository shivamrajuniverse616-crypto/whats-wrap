import React from 'react';
import { Download, History, Quote } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function FirstMessage({ data }) {
  if (!data || !data.firstMessage) return null;
  const { firstMessage } = data;

  return (
    <div className="anim-fade-up" id="first-message-card">
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(236,72,153,0.15)' }}>
              <History size={15} color="#ec4899" />
            </div>
            <span className="section-title">Nostalgia Trip</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('first-message-card', 'whatswrap-first-message')}
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
          The exact moment the conversation started
        </p>
      </div>

      <div className="m3-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -30, right: -20, opacity: 0.05,
          transform: 'rotate(15deg)'
        }}>
          <Quote size={160} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', background: 'rgba(236,72,153,0.1)',
            borderRadius: 999, border: '1px solid rgba(236,72,153,0.2)',
            color: '#ec4899', fontSize: '0.75rem', fontWeight: 700,
            marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>
            <History size={14} /> The Very First Message
          </div>

          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--on-surface)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: 24,
            maxWidth: '90%'
          }}>
            "{firstMessage.content || 'Media omitted'}"
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingTop: 20,
            borderTop: '1px solid var(--card-border)'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--grad-pink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '1rem'
            }}>
              {firstMessage.sender.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--on-surface)' }}>
                Sent by {firstMessage.sender}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-mute)' }}>
                {firstMessage.dateStr} at {firstMessage.timeStr}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
