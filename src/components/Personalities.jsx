import React from 'react';
import { UserCircle2, Moon, Sparkles, Edit3, Zap, MessageSquare, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

const PALETTE = {
  purple:  { accent: '#0077b6', border: 'rgba(0,119,182,0.15)',  badge: 'rgba(0,119,182,0.06)', grad: 'linear-gradient(135deg,#cbeffa,#90e0ef)' },
  gold:    { accent: '#b57c00', border: 'rgba(181,124,0,0.15)',   badge: 'rgba(181,124,0,0.06)',   grad: 'linear-gradient(135deg,#ffe8a3,#ffb703)' },
  emerald: { accent: '#0077b6', border: 'rgba(0,180,216,0.15)',   badge: 'rgba(0,180,216,0.06)',   grad: 'linear-gradient(135deg,#bbf0f9,#00b4d8)' },
  sunset:  { accent: '#00a896', border: 'rgba(0,168,150,0.15)',   badge: 'rgba(0,168,150,0.06)',   grad: 'linear-gradient(135deg,#a8f2eb,#00a896)' },
};

const PERSONALITY_ICONS = {
  'The Night Owl': Moon,
  'The Reactor': Sparkles,
  'The Novelist': Edit3,
  'The Speed Typer': Zap,
  'The Conversationalist': MessageSquare,
};

export default function Personalities({ personalities }) {
  return (
    <div className="anim-fade-up" id="personalities-card">
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(0,78,100,0.08)' }}>
              <UserCircle2 size={15} color="var(--primary)" />
            </div>
            <span className="section-title">Chat Personalities</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('personalities-card', 'whatswrap-personalities')}
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
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>Your unique texting archetypes revealed</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {personalities.map((profile, idx) => {
          const pal = PALETTE[profile.colorClass] || PALETTE.purple;
          const PersonalityIcon = PERSONALITY_ICONS[profile.role] || MessageSquare;

          return (
            <div
              key={idx}
              className="m3-card hover-lift"
              style={{
                border: `1px solid ${pal.border}`,
                overflow: 'hidden',
              }}
            >
              {/* Gradient header strip */}
              <div style={{
                background: pal.grad,
                padding: '20px 20px 48px',
                position: 'relative',
              }}>
                {/* Decorative circle */}
                <div style={{
                  position: 'absolute', bottom: -30, right: -30,
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                }} />
                <div style={{
                  fontSize: '0.62rem', fontWeight: 700,
                  color: 'var(--on-surface-mute)',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                }}>
                  Chat Personality
                </div>
              </div>

              {/* Avatar circle (overlaps header) */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                marginTop: -36, padding: '0 20px 24px',
                position: 'relative', zIndex: 1,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: pal.badge,
                  border: `3px solid var(--bg-surface)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.15)`,
                }}>
                  <PersonalityIcon size={28} color={pal.accent} />
                </div>

                {/* Favorite emoji badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'var(--bg-surface-3)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 999, padding: '2px 10px',
                  fontSize: '0.8rem', marginBottom: 12,
                }}>
                  {profile.favoriteEmoji}
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem', fontWeight: 900,
                  color: 'var(--on-surface)', textAlign: 'center',
                  marginBottom: 6,
                }}>
                  {profile.user}
                </h3>

                {/* Role badge */}
                <div style={{
                  display: 'inline-flex',
                  background: pal.badge,
                  border: `1px solid ${pal.border}`,
                  borderRadius: 999, padding: '4px 14px',
                  fontSize: '0.72rem', fontWeight: 700,
                  color: pal.accent,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: 12,
                }}>
                  {profile.role}
                </div>

                <div style={{
                  fontSize: '0.78rem', color: 'var(--on-surface-dim)',
                  textAlign: 'center', marginBottom: 8, fontWeight: 500,
                }}>
                  {profile.subtitle}
                </div>

                <p style={{
                  fontSize: '0.78rem', color: 'var(--on-surface-mute)',
                  textAlign: 'center', lineHeight: 1.6,
                }}>
                  {profile.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
